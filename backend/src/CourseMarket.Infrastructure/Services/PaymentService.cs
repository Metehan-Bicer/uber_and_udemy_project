using CourseMarket.Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Stripe;

namespace CourseMarket.Infrastructure.Services;

public class PaymentService : IPaymentService
{
    private readonly IApplicationDbContext _context;
    private readonly IConfiguration _configuration;

    public PaymentService(IApplicationDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;

        // Set Stripe API key
        StripeConfiguration.ApiKey = _configuration["Stripe:SecretKey"];
    }

    public async Task<string> CreatePaymentIntentAsync(int courseId, int userId, CancellationToken cancellationToken = default)
    {
        // Get course details
        var course = await _context.Courses
            .FirstOrDefaultAsync(c => c.Id == courseId, cancellationToken);

        if (course == null)
        {
            throw new InvalidOperationException("Course not found");
        }

        // Check if user already purchased this course
        var existingPurchase = await _context.Purchases
            .AnyAsync(p => p.UserId == userId && p.CourseId == courseId && p.Status == Domain.Enums.PurchaseStatus.Completed,
                cancellationToken);

        if (existingPurchase)
        {
            throw new InvalidOperationException("Course already purchased");
        }

        // Create Stripe PaymentIntent
        var options = new PaymentIntentCreateOptions
        {
            Amount = (long)(course.Price * 100), // Convert to cents
            Currency = "usd",
            AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
            {
                Enabled = true,
            },
            Metadata = new Dictionary<string, string>
            {
                { "courseId", courseId.ToString() },
                { "userId", userId.ToString() },
                { "courseName", course.Title }
            }
        };

        var service = new PaymentIntentService();
        var paymentIntent = await service.CreateAsync(options, cancellationToken: cancellationToken);

        return paymentIntent.ClientSecret;
    }

    public async Task<bool> VerifyPaymentAsync(string paymentIntentId, CancellationToken cancellationToken = default)
    {
        try
        {
            var service = new PaymentIntentService();
            var paymentIntent = await service.GetAsync(paymentIntentId, cancellationToken: cancellationToken);

            return paymentIntent.Status == "succeeded";
        }
        catch
        {
            return false;
        }
    }

    public async Task<string?> GetPaymentIntentStatusAsync(string paymentIntentId, CancellationToken cancellationToken = default)
    {
        try
        {
            var service = new PaymentIntentService();
            var paymentIntent = await service.GetAsync(paymentIntentId, cancellationToken: cancellationToken);

            return paymentIntent.Status;
        }
        catch
        {
            return null;
        }
    }
}
