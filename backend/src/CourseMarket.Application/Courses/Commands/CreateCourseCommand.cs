using CourseMarket.Application.Common.Interfaces;
using CourseMarket.Application.Common.Models;
using CourseMarket.Application.Courses.DTOs;
using CourseMarket.Domain.Entities;
using MediatR;

namespace CourseMarket.Application.Courses.Commands;

public class CreateCourseCommand : IRequest<Result<CourseDto>>
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string? ImageUrl { get; set; }
}

public class CreateCourseCommandHandler : IRequestHandler<CreateCourseCommand, Result<CourseDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public CreateCourseCommandHandler(IApplicationDbContext context, ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<Result<CourseDto>> Handle(CreateCourseCommand request, CancellationToken cancellationToken)
    {
        var instructorId = _currentUser.UserId;

        var course = new Course
        {
            Title = request.Title,
            Description = request.Description,
            Price = request.Price,
            ImageUrl = request.ImageUrl,
            InstructorId = instructorId,
            IsActive = true
        };

        _context.Courses.Add(course);
        await _context.SaveChangesAsync(cancellationToken);

        // Reload to get instructor details
        var createdCourse = await _context.Courses
            .FindAsync(new object[] { course.Id }, cancellationToken);

        var instructor = await _context.Users
            .FindAsync(new object[] { instructorId }, cancellationToken);

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
                Id = instructor!.Id,
                FirstName = instructor.FirstName,
                LastName = instructor.LastName,
                Email = instructor.Email
            }
        };

        return Result<CourseDto>.Success(courseDto);
    }
}
