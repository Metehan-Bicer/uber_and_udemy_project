using CourseMarket.Domain.Common;
using CourseMarket.Domain.Enums;

namespace CourseMarket.Domain.Entities;

public class User : BaseEntity
{
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public UserRole Role { get; set; }

    // Navigation properties
    public ICollection<Course> CoursesAsInstructor { get; set; } = new List<Course>();
    public ICollection<Purchase> Purchases { get; set; } = new List<Purchase>();
    public ICollection<LiveLessonRequest> LessonRequests { get; set; } = new List<LiveLessonRequest>();
    public ICollection<InstructorAssignment> Assignments { get; set; } = new List<InstructorAssignment>();
    public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
}
