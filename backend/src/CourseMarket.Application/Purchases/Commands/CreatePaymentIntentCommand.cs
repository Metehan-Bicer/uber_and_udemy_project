using CourseMarket.Application.Common.Interfaces;
using CourseMarket.Application.Common.Models;
using CourseMarket.Application.Purchases.DTOs;
using MediatR;

namespace CourseMarket.Application.Purchases.Commands;

public class CreatePaymentIntentCommand : IRequest<Result<PaymentIntentResponseDto>>
{
    public int CourseId { get; set; }
}

public class CreatePaymentIntentCommandHandler : IRequestHandler<CreatePaymentIntentCommand, Result<PaymentIntentResponseDto>>
{
    private readonly IPaymentService _paymentService;
    private readonly ICurrentUserService _currentUser;

    public CreatePaymentIntentCommandHandler(IPaymentService paymentService, ICurrentUserService currentUser)
    {
        _paymentService = paymentService;
        _currentUser = currentUser;
    }

    public async Task<Result<PaymentIntentResponseDto>> Handle(CreatePaymentIntentCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var userId = _currentUser.UserId;

            var clientSecret = await _paymentService.CreatePaymentIntentAsync(request.CourseId, userId, cancellationToken);

            // Extract PaymentIntent ID from client secret (format: pi_xxx_secret_yyy)
            var paymentIntentId = clientSecret.Split('_')[0] + "_" + clientSecret.Split('_')[1];

            var response = new PaymentIntentResponseDto
            {
                ClientSecret = clientSecret,
                PaymentIntentId = paymentIntentId
            };

            return Result<PaymentIntentResponseDto>.Success(response);
        }
        catch (InvalidOperationException ex)
        {
            return Result<PaymentIntentResponseDto>.Failure(ex.Message);
        }
        catch (Exception ex)
        {
            return Result<PaymentIntentResponseDto>.Failure($"Failed to create payment intent: {ex.Message}");
        }
    }
}
