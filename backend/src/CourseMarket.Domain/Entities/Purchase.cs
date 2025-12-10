using CourseMarket.Domain.Common;
using CourseMarket.Domain.Enums;

namespace CourseMarket.Domain.Entities;

public class Purchase : BaseEntity
{
    public int UserId { get; set; }
    public int CourseId { get; set; }
    public decimal Amount { get; set; }
    public string StripePaymentIntentId { get; set; } = string.Empty;
    public PurchaseStatus Status { get; set; }
    public DateTime PurchasedAt { get; set; }

    // Navigation properties
    public User User { get; set; } = null!;
    public Course Course { get; set; } = null!;
}
