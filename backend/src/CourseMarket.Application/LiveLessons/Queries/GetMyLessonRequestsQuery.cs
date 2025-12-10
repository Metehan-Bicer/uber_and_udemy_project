using CourseMarket.Application.Common.Interfaces;
using CourseMarket.Application.Common.Models;
using CourseMarket.Application.LiveLessons.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CourseMarket.Application.LiveLessons.Queries;

public class GetMyLessonRequestsQuery : IRequest<Result<List<LiveLessonRequestDto>>>
{
}

public class GetMyLessonRequestsQueryHandler : IRequestHandler<GetMyLessonRequestsQuery, Result<List<LiveLessonRequestDto>>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public GetMyLessonRequestsQueryHandler(IApplicationDbContext context, ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<Result<List<LiveLessonRequestDto>>> Handle(GetMyLessonRequestsQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUser.UserId;

        var lessonRequests = await _context.LiveLessonRequests
            .Where(lr => lr.UserId == userId)
            .OrderByDescending(lr => lr.CreatedAt)
            .Select(lr => new LiveLessonRequestDto
            {
                Id = lr.Id,
                UserId = lr.UserId,
                Topic = lr.Topic,
                Description = lr.Description,
                PreferredDate = lr.PreferredDate,
                Duration = lr.Duration,
                Status = lr.Status,
                CreatedAt = lr.CreatedAt,
                Assignment = _context.InstructorAssignments
                    .Where(ia => ia.RequestId == lr.Id)
                    .Select(ia => new InstructorAssignmentDto
                    {
                        Id = ia.Id,
                        RequestId = ia.RequestId,
                        InstructorId = ia.InstructorId,
                        InstructorName = ia.Instructor.FirstName + " " + ia.Instructor.LastName,
                        InstructorEmail = ia.Instructor.Email,
                        MatchScore = ia.MatchScore,
                        AssignedAt = ia.AssignedAt,
                        Status = ia.Status
                    })
                    .FirstOrDefault()
            })
            .ToListAsync(cancellationToken);

        return Result<List<LiveLessonRequestDto>>.Success(lessonRequests);
    }
}
