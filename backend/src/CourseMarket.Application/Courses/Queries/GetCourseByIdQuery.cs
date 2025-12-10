using CourseMarket.Application.Common.Interfaces;
using CourseMarket.Application.Common.Models;
using CourseMarket.Application.Courses.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CourseMarket.Application.Courses.Queries;

public class GetCourseByIdQuery : IRequest<Result<CourseDto>>
{
    public int CourseId { get; set; }
}

public class GetCourseByIdQueryHandler : IRequestHandler<GetCourseByIdQuery, Result<CourseDto>>
{
    private readonly IApplicationDbContext _context;

    public GetCourseByIdQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<CourseDto>> Handle(GetCourseByIdQuery request, CancellationToken cancellationToken)
    {
        var course = await _context.Courses
            .Include(c => c.Instructor)
            .FirstOrDefaultAsync(c => c.Id == request.CourseId, cancellationToken);

        if (course == null)
        {
            return Result<CourseDto>.Failure("Course not found");
        }

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
