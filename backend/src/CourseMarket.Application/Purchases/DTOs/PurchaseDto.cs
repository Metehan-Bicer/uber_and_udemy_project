using CourseMarket.Domain.Enums;

namespace CourseMarket.Application.Purchases.DTOs;

public class PurchaseDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int CourseId { get; set; }
    public string CourseTitle { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string? StripePaymentIntentId { get; set; }
    public PurchaseStatus Status { get; set; }
    public DateTime PurchasedAt { get; set; }
}

public class PaymentIntentResponseDto
{
    public string ClientSecret { get; set; } = string.Empty;
    public string PaymentIntentId { get; set; } = string.Empty;
}
