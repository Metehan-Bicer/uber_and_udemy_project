using CourseMarket.Application.Common.Interfaces;
using CourseMarket.Application.Common.Models;
using CourseMarket.Application.LiveLessons.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CourseMarket.Application.LiveLessons.Queries;

public class GetAssignedLessonsQuery : IRequest<Result<List<AssignedLessonDto>>>
{
}

public class GetAssignedLessonsQueryHandler : IRequestHandler<GetAssignedLessonsQuery, Result<List<AssignedLessonDto>>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public GetAssignedLessonsQueryHandler(IApplicationDbContext context, ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<Result<List<AssignedLessonDto>>> Handle(GetAssignedLessonsQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUser.UserId;

        var assignedLessons = await _context.InstructorAssignments
            .Where(ia => ia.InstructorId == userId)
            .Include(ia => ia.Request)
            .ThenInclude(r => r.User)
            .OrderByDescending(ia => ia.AssignedAt)
            .Select(ia => new AssignedLessonDto
            {
                Id = ia.Id,
                RequestId = ia.RequestId,
                Topic = ia.Request.Topic,
                Description = ia.Request.Description,
                PreferredDate = ia.Request.PreferredDate,
                Duration = ia.Request.Duration,
                StudentName = ia.Request.User.FirstName + " " + ia.Request.User.LastName,
                StudentEmail = ia.Request.User.Email,
                MatchScore = ia.MatchScore,
                Status = ia.Status,
                AssignedAt = ia.AssignedAt
            })
            .ToListAsync(cancellationToken);

        return Result<List<AssignedLessonDto>>.Success(assignedLessons);
    }
}
