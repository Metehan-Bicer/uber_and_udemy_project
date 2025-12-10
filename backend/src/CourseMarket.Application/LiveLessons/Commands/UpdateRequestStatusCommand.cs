using CourseMarket.Application.Common.Interfaces;
using CourseMarket.Application.Common.Models;
using CourseMarket.Application.LiveLessons.DTOs;
using CourseMarket.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CourseMarket.Application.LiveLessons.Commands;

public class UpdateRequestStatusCommand : IRequest<Result<LiveLessonRequestDto>>
{
    public int RequestId { get; set; }
    public RequestStatus Status { get; set; }
}

public class UpdateRequestStatusCommandHandler : IRequestHandler<UpdateRequestStatusCommand, Result<LiveLessonRequestDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public UpdateRequestStatusCommandHandler(IApplicationDbContext context, ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<Result<LiveLessonRequestDto>> Handle(UpdateRequestStatusCommand request, CancellationToken cancellationToken)
    {
        var lessonRequest = await _context.LiveLessonRequests
            .FirstOrDefaultAsync(lr => lr.Id == request.RequestId, cancellationToken);

        if (lessonRequest == null)
        {
            return Result<LiveLessonRequestDto>.Failure("Lesson request not found");
        }

        var userId = _currentUser.UserId;
        var userRole = _currentUser.Role;

        // Check permissions
        var assignment = await _context.InstructorAssignments
            .Include(ia => ia.Instructor)
            .FirstOrDefaultAsync(ia => ia.RequestId == request.RequestId, cancellationToken);

        // User can update their own request, or instructor can update assigned request, or admin can update any
        if (lessonRequest.UserId != userId &&
            (assignment == null || assignment.InstructorId != userId) &&
            userRole != UserRole.Admin.ToString())
        {
            return Result<LiveLessonRequestDto>.Failure("You don't have permission to update this request");
        }

        // Update status
        lessonRequest.Status = request.Status;

        if (assignment != null)
        {
            assignment.Status = request.Status;
        }

        await _context.SaveChangesAsync(cancellationToken);

        // Prepare response
        var response = new LiveLessonRequestDto
        {
            Id = lessonRequest.Id,
            UserId = lessonRequest.UserId,
            Topic = lessonRequest.Topic,
            Description = lessonRequest.Description,
            PreferredDate = lessonRequest.PreferredDate,
            Duration = lessonRequest.Duration,
            Status = lessonRequest.Status,
            CreatedAt = lessonRequest.CreatedAt,
            Assignment = assignment != null ? new InstructorAssignmentDto
            {
                Id = assignment.Id,
                RequestId = assignment.RequestId,
                InstructorId = assignment.InstructorId,
                InstructorName = $"{assignment.Instructor.FirstName} {assignment.Instructor.LastName}",
                InstructorEmail = assignment.Instructor.Email,
                MatchScore = assignment.MatchScore,
                AssignedAt = assignment.AssignedAt,
                Status = assignment.Status
            } : null
        };

        return Result<LiveLessonRequestDto>.Success(response);
    }
}
