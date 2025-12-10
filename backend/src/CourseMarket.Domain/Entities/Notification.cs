using CourseMarket.Domain.Common;
using CourseMarket.Domain.Enums;

namespace CourseMarket.Domain.Entities;

public class Notification : BaseEntity
{
    public int UserId { get; set; }
    public NotificationType Type { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public bool IsRead { get; set; } = false;
    public int? RelatedEntityId { get; set; }

    // Navigation properties
    public User User { get; set; } = null!;
}
