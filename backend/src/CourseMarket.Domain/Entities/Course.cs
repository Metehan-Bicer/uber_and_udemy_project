using CourseMarket.Domain.Common;

namespace CourseMarket.Domain.Entities;

public class Course : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int InstructorId { get; set; }
    public string? ImageUrl { get; set; }
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public User Instructor { get; set; } = null!;
    public ICollection<Purchase> Purchases { get; set; } = new List<Purchase>();
}
