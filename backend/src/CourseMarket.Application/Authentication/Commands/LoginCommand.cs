using CourseMarket.Application.Authentication.DTOs;
using CourseMarket.Application.Authentication.Services;
using CourseMarket.Application.Common.Interfaces;
using CourseMarket.Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CourseMarket.Application.Authentication.Commands;

public class LoginCommand : IRequest<Result<AuthResponseDto>>
{
    public LoginDto LoginDto { get; set; } = null!;
}

public class LoginCommandHandler : IRequestHandler<LoginCommand, Result<AuthResponseDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly ITokenService _tokenService;

    public LoginCommandHandler(IApplicationDbContext context, ITokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
    }

    public async Task<Result<AuthResponseDto>> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var dto = request.LoginDto;

        // Find user
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == dto.Email, cancellationToken);

        if (user == null)
        {
            return Result<AuthResponseDto>.Failure("Invalid email or password");
        }

        // Verify password
        if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
        {
            return Result<AuthResponseDto>.Failure("Invalid email or password");
        }

        // Generate token
        var token = _tokenService.GenerateToken(user);

        var response = new AuthResponseDto
        {
            Token = token,
            User = new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Role = user.Role.ToString()
            }
        };

        return Result<AuthResponseDto>.Success(response);
    }
}
