using CourseMarket.Domain.Common;
using CourseMarket.Domain.Enums;

namespace CourseMarket.Domain.Entities;

public class InstructorAssignment : BaseEntity
{
    public int RequestId { get; set; }
    public int InstructorId { get; set; }
    public DateTime AssignedAt { get; set; }
    public double MatchScore { get; set; }
    public RequestStatus Status { get; set; }

    // Navigation properties
    public LiveLessonRequest Request { get; set; } = null!;
    public User Instructor { get; set; } = null!;
}
