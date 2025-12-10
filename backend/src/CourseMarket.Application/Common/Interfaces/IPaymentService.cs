namespace CourseMarket.Application.Common.Interfaces;

public interface IPaymentService
{
    Task<string> CreatePaymentIntentAsync(int courseId, int userId, CancellationToken cancellationToken = default);
    Task<bool> VerifyPaymentAsync(string paymentIntentId, CancellationToken cancellationToken = default);
    Task<string?> GetPaymentIntentStatusAsync(string paymentIntentId, CancellationToken cancellationToken = default);
}
