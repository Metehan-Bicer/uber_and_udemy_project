using CourseMarket.Application.Common.Interfaces;
using CourseMarket.Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CourseMarket.Application.Notifications.Commands;

public class MarkNotificationAsReadCommand : IRequest<Result<bool>>
{
    public int NotificationId { get; set; }
}

public class MarkNotificationAsReadCommandHandler : IRequestHandler<MarkNotificationAsReadCommand, Result<bool>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public MarkNotificationAsReadCommandHandler(IApplicationDbContext context, ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<Result<bool>> Handle(MarkNotificationAsReadCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUser.UserId;

        var notification = await _context.Notifications
            .FirstOrDefaultAsync(n => n.Id == request.NotificationId && n.UserId == userId, cancellationToken);

        if (notification == null)
        {
            return Result<bool>.Failure("Notification not found");
        }

        notification.IsRead = true;
        await _context.SaveChangesAsync(cancellationToken);

        return Result<bool>.Success(true);
    }
}
