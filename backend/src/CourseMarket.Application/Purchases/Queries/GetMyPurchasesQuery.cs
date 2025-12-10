using CourseMarket.Application.Common.Interfaces;
using CourseMarket.Application.Common.Models;
using CourseMarket.Application.Purchases.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CourseMarket.Application.Purchases.Queries;

public class GetMyPurchasesQuery : IRequest<Result<List<PurchaseDto>>>
{
}

public class GetMyPurchasesQueryHandler : IRequestHandler<GetMyPurchasesQuery, Result<List<PurchaseDto>>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public GetMyPurchasesQueryHandler(IApplicationDbContext context, ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<Result<List<PurchaseDto>>> Handle(GetMyPurchasesQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUser.UserId;

        var purchases = await _context.Purchases
            .Include(p => p.Course)
            .Where(p => p.UserId == userId)
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => new PurchaseDto
            {
                Id = p.Id,
                UserId = p.UserId,
                CourseId = p.CourseId,
                CourseTitle = p.Course.Title,
                Amount = p.Amount,
                StripePaymentIntentId = p.StripePaymentIntentId,
                Status = p.Status,
                PurchasedAt = p.CreatedAt
            })
            .ToListAsync(cancellationToken);

        return Result<List<PurchaseDto>>.Success(purchases);
    }
}
