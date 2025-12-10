using CourseMarket.Application.Common.Interfaces;
using CourseMarket.Application.Common.Models;
using CourseMarket.Application.Purchases.DTOs;
using CourseMarket.Domain.Entities;
using CourseMarket.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Stripe;

namespace CourseMarket.Application.Purchases.Commands;

public class ConfirmPurchaseCommand : IRequest<Result<PurchaseDto>>
{
    public string PaymentIntentId { get; set; } = string.Empty;
}

public class ConfirmPurchaseCommandHandler : IRequestHandler<ConfirmPurchaseCommand, Result<PurchaseDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IPaymentService _paymentService;
    private readonly ICurrentUserService _currentUser;

    public ConfirmPurchaseCommandHandler(
        IApplicationDbContext context,
        IPaymentService paymentService,
        ICurrentUserService currentUser)
    {
        _context = context;
        _paymentService = paymentService;
        _currentUser = currentUser;
    }

    public async Task<Result<PurchaseDto>> Handle(ConfirmPurchaseCommand request, CancellationToken cancellationToken)
    {
        // Verify payment with Stripe
        var isPaymentSuccessful = await _paymentService.VerifyPaymentAsync(request.PaymentIntentId, cancellationToken);

        if (!isPaymentSuccessful)
        {
            return Result<PurchaseDto>.Failure("Payment verification failed");
        }

        // Check if purchase already exists (idempotency)
        var existingPurchase = await _context.Purchases
            .Include(p => p.Course)
            .FirstOrDefaultAsync(p => p.StripePaymentIntentId == request.PaymentIntentId, cancellationToken);

        if (existingPurchase != null)
        {
            // Return existing purchase
            return Result<PurchaseDto>.Success(new PurchaseDto
            {
                Id = existingPurchase.Id,
                UserId = existingPurchase.UserId,
                CourseId = existingPurchase.CourseId,
                CourseTitle = existingPurchase.Course.Title,
                Amount = existingPurchase.Amount,
                StripePaymentIntentId = existingPurchase.StripePaymentIntentId,
                Status = existingPurchase.Status,
                PurchasedAt = existingPurchase.CreatedAt
            });
        }

        // Get payment intent details
        int courseId;
        
        if (request.PaymentIntentId.StartsWith("mock_secret_"))
        {
            // Format: mock_secret_{guid}_{courseId}_{userId}
            var parts = request.PaymentIntentId.Split('_');
            if (parts.Length >= 4)
            {
                courseId = int.Parse(parts[3]);
            }
            else
            {
                 return Result<PurchaseDto>.Failure("Invalid mock payment token");
            }
        }
        else
        {
            // Get payment intent details from Stripe to extract metadata
            var service = new PaymentIntentService();
            var paymentIntent = await service.GetAsync(request.PaymentIntentId, cancellationToken: cancellationToken);
            courseId = int.Parse(paymentIntent.Metadata["courseId"]);
        }
        var userId = _currentUser.UserId;

        // Get course
        var course = await _context.Courses
            .FirstOrDefaultAsync(c => c.Id == courseId, cancellationToken);

        if (course == null)
        {
            return Result<PurchaseDto>.Failure("Course not found");
        }

        // Create purchase record
        var purchase = new Purchase
        {
            UserId = userId,
            CourseId = courseId,
            Amount = course.Price,
            StripePaymentIntentId = request.PaymentIntentId,
            Status = PurchaseStatus.Completed
        };

        _context.Purchases.Add(purchase);
        await _context.SaveChangesAsync(cancellationToken);

        // Create notification for user
        var notification = new Notification
        {
            UserId = userId,
            Type = NotificationType.PurchaseConfirmation,
            Title = "Purchase Successful",
            Message = $"You have successfully purchased '{course.Title}'",
            IsRead = false
        };

        _context.Notifications.Add(notification);
        await _context.SaveChangesAsync(cancellationToken);

        var purchaseDto = new PurchaseDto
        {
            Id = purchase.Id,
            UserId = purchase.UserId,
            CourseId = purchase.CourseId,
            CourseTitle = course.Title,
            Amount = purchase.Amount,
            StripePaymentIntentId = purchase.StripePaymentIntentId,
            Status = purchase.Status,
            PurchasedAt = purchase.CreatedAt
        };

        return Result<PurchaseDto>.Success(purchaseDto);
    }
}
