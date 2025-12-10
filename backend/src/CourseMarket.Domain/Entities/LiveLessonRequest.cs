using CourseMarket.Domain.Common;
using CourseMarket.Domain.Enums;

namespace CourseMarket.Domain.Entities;

public class LiveLessonRequest : BaseEntity
{
    public int UserId { get; set; }
    public string Topic { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime? PreferredDate { get; set; }
    public int Duration { get; set; } // in minutes
    public RequestStatus Status { get; set; }

    // Navigation properties
    public User User { get; set; } = null!;
    public InstructorAssignment? Assignment { get; set; }
}
