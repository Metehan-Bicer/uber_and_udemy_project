using CourseMarket.Domain.Entities;

namespace CourseMarket.Application.Authentication.Services;

public interface ITokenService
{
    string GenerateToken(User user);
}
