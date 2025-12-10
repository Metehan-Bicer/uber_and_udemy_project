using CourseMarket.Application.Common.Interfaces;
using CourseMarket.Application.Common.Models;
using CourseMarket.Application.Courses.DTOs;
using CourseMarket.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CourseMarket.Application.Courses.Commands;

public class UpdateCourseCommand : IRequest<Result<CourseDto>>
{
    public int CourseId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string? ImageUrl { get; set; }
    public bool IsActive { get; set; }
}

public class UpdateCourseCommandHandler : IRequestHandler<UpdateCourseCommand, Result<CourseDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public UpdateCourseCommandHandler(IApplicationDbContext context, ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<Result<CourseDto>> Handle(UpdateCourseCommand request, CancellationToken cancellationToken)
    {
        var course = await _context.Courses
            .Include(c => c.Instructor)
            .FirstOrDefaultAsync(c => c.Id == request.CourseId, cancellationToken);

        if (course == null)
        {
            return Result<CourseDto>.Failure("Course not found");
        }

        // Check if user is the instructor or admin
        var userId = _currentUser.UserId;
        var userRole = _currentUser.Role;

        if (course.InstructorId != userId && userRole != UserRole.Admin.ToString())
        {
            return Result<CourseDto>.Failure("You don't have permission to update this course");
        }

        // Update course
        course.Title = request.Title;
        course.Description = request.Description;
        course.Price = request.Price;
        course.ImageUrl = request.ImageUrl;
        course.IsActive = request.IsActive;

        await _context.SaveChangesAsync(cancellationToken);

        var courseDto = new CourseDto
        {
            Id = course.Id,
            Title = course.Title,
            Description = course.Description,
            Price = course.Price,
            ImageUrl = course.ImageUrl,
            IsActive = course.IsActive,
            CreatedAt = course.CreatedAt,
            Instructor = new InstructorDto
            {
                Id = course.Instructor.Id,
                FirstName = course.Instructor.FirstName,
                LastName = course.Instructor.LastName,
                Email = course.Instructor.Email
            }
        };

        return Result<CourseDto>.Success(courseDto);
    }
}
