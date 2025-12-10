using CourseMarket.Application.Common.Interfaces;
using CourseMarket.Domain.Entities;
using CourseMarket.Domain.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;

namespace CourseMarket.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WebhooksController : ControllerBase
{
    private readonly IApplicationDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly ILogger<WebhooksController> _logger;

    public WebhooksController(
        IApplicationDbContext context,
        IConfiguration configuration,
        ILogger<WebhooksController> logger)
    {
        _context = context;
        _configuration = configuration;
        _logger = logger;
    }

    [HttpPost("stripe")]
    public async Task<IActionResult> StripeWebhook()
    {
        var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();

        try
        {
            var stripeEvent = EventUtility.ConstructEvent(
                json,
                Request.Headers["Stripe-Signature"],
                _configuration["Stripe:WebhookSecret"]
            );

            _logger.LogInformation("Stripe webhook received: {EventType}", stripeEvent.Type);

            // Handle the event
            if (stripeEvent.Type == "payment_intent.succeeded")
            {
                var paymentIntent = stripeEvent.Data.Object as PaymentIntent;

                if (paymentIntent != null)
                {
                    await HandlePaymentIntentSucceeded(paymentIntent);
                }
            }
            else if (stripeEvent.Type == "payment_intent.payment_failed")
            {
                var paymentIntent = stripeEvent.Data.Object as PaymentIntent;

                if (paymentIntent != null)
                {
                    await HandlePaymentIntentFailed(paymentIntent);
                }
            }

            return Ok();
        }
        catch (StripeException ex)
        {
            _logger.LogError(ex, "Stripe webhook error");
            return BadRequest();
        }
    }

    private async Task HandlePaymentIntentSucceeded(PaymentIntent paymentIntent)
    {
        _logger.LogInformation("Payment succeeded: {PaymentIntentId}", paymentIntent.Id);

        // Check if purchase already exists
        var existingPurchase = await _context.Purchases
            .FirstOrDefaultAsync(p => p.StripePaymentIntentId == paymentIntent.Id);

        if (existingPurchase != null)
        {
            // Already processed
            _logger.LogInformation("Purchase already exists for PaymentIntent: {PaymentIntentId}", paymentIntent.Id);
            return;
        }

        // Extract metadata
        if (paymentIntent.Metadata.TryGetValue("courseId", out var courseIdStr) &&
            paymentIntent.Metadata.TryGetValue("userId", out var userIdStr))
        {
            var courseId = int.Parse(courseIdStr);
            var userId = int.Parse(userIdStr);

            var course = await _context.Courses.FindAsync(courseId);

            if (course != null)
            {
                // Create purchase record
                var purchase = new Purchase
                {
                    UserId = userId,
                    CourseId = courseId,
                    Amount = course.Price,
                    StripePaymentIntentId = paymentIntent.Id,
                    Status = PurchaseStatus.Completed
                };

                _context.Purchases.Add(purchase);

                // Create notification
                var notification = new Notification
                {
                    UserId = userId,
                    Type = NotificationType.PurchaseConfirmation,
                    Title = "Purchase Confirmed",
                    Message = $"Your purchase of '{course.Title}' has been confirmed via webhook",
                    IsRead = false
                };

                _context.Notifications.Add(notification);

                await _context.SaveChangesAsync(default);

                _logger.LogInformation("Purchase created via webhook for User {UserId}, Course {CourseId}", userId, courseId);
            }
        }
    }

    private async Task HandlePaymentIntentFailed(PaymentIntent paymentIntent)
    {
        _logger.LogWarning("Payment failed: {PaymentIntentId}", paymentIntent.Id);

        // Update purchase status if it exists
        var purchase = await _context.Purchases
            .FirstOrDefaultAsync(p => p.StripePaymentIntentId == paymentIntent.Id);

        if (purchase != null)
        {
            purchase.Status = PurchaseStatus.Failed;
            await _context.SaveChangesAsync(default);

            // Create notification
            var notification = new Notification
            {
                UserId = purchase.UserId,
                Type = NotificationType.General,
                Title = "Payment Failed",
                Message = "Your payment has failed. Please try again.",
                IsRead = false
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync(default);
        }
    }
}
