using CourseMarket.Domain.Enums;

namespace CourseMarket.Application.LiveLessons.DTOs;

public class LiveLessonRequestDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Topic { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime? PreferredDate { get; set; }
    public int Duration { get; set; }
    public RequestStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public InstructorAssignmentDto? Assignment { get; set; }
}

public class InstructorAssignmentDto
{
    public int Id { get; set; }
    public int RequestId { get; set; }
    public int InstructorId { get; set; }
    public string InstructorName { get; set; } = string.Empty;
    public string InstructorEmail { get; set; } = string.Empty;
    public double MatchScore { get; set; }
    public DateTime AssignedAt { get; set; }
    public RequestStatus Status { get; set; }
}

public class AssignedLessonDto
{
    public int Id { get; set; }
    public int RequestId { get; set; }
    public string Topic { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime? PreferredDate { get; set; }
    public int Duration { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public string StudentEmail { get; set; } = string.Empty;
    public double MatchScore { get; set; }
    public RequestStatus Status { get; set; }
    public DateTime AssignedAt { get; set; }
}
