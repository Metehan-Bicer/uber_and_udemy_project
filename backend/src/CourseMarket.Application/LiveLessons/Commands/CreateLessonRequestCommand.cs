using CourseMarket.Application.Common.Interfaces;
using CourseMarket.Application.Common.Models;
using CourseMarket.Application.LiveLessons.DTOs;
using CourseMarket.Domain.Entities;
using CourseMarket.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CourseMarket.Application.LiveLessons.Commands;

public class CreateLessonRequestCommand : IRequest<Result<LiveLessonRequestDto>>
{
    public string Topic { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime? PreferredDate { get; set; }
    public int Duration { get; set; }
}

public class CreateLessonRequestCommandHandler : IRequestHandler<CreateLessonRequestCommand, Result<LiveLessonRequestDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;
    private readonly IInstructorMatchingService _matchingService;

    public CreateLessonRequestCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser,
        IInstructorMatchingService matchingService)
    {
        _context = context;
        _currentUser = currentUser;
        _matchingService = matchingService;
    }

    public async Task<Result<LiveLessonRequestDto>> Handle(CreateLessonRequestCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUser.UserId;

        // Create lesson request
        var lessonRequest = new LiveLessonRequest
        {
            UserId = userId,
            Topic = request.Topic,
            Description = request.Description,
            PreferredDate = request.PreferredDate,
            Duration = request.Duration,
            Status = RequestStatus.Pending
        };

        _context.LiveLessonRequests.Add(lessonRequest);
        await _context.SaveChangesAsync(cancellationToken);

        // Find best instructor using matching algorithm
        var (instructorId, matchScore) = await _matchingService.FindBestInstructorAsync(
            request.Topic,
            request.Description,
            cancellationToken);

        // Create instructor assignment
        var assignment = new InstructorAssignment
        {
            RequestId = lessonRequest.Id,
            InstructorId = instructorId,
            MatchScore = matchScore,
            Status = RequestStatus.Assigned
        };

        _context.InstructorAssignments.Add(assignment);

        // Update lesson request status
        lessonRequest.Status = RequestStatus.Assigned;

        await _context.SaveChangesAsync(cancellationToken);

        // Get instructor details
        var instructor = await _context.Users.FindAsync(new object[] { instructorId }, cancellationToken);

        // Create notification for instructor
        var notification = new Notification
        {
            UserId = instructorId,
            Type = NotificationType.LessonAssignment,
            Title = "New Lesson Assigned",
            Message = $"You have been assigned a new lesson request: '{request.Topic}'",
            IsRead = false
        };

        _context.Notifications.Add(notification);
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
            Assignment = new InstructorAssignmentDto
            {
                Id = assignment.Id,
                RequestId = assignment.RequestId,
                InstructorId = assignment.InstructorId,
                InstructorName = $"{instructor!.FirstName} {instructor.LastName}",
                InstructorEmail = instructor.Email,
                MatchScore = assignment.MatchScore,
                AssignedAt = assignment.AssignedAt,
                Status = assignment.Status
            }
        };

        return Result<LiveLessonRequestDto>.Success(response);
    }
}
