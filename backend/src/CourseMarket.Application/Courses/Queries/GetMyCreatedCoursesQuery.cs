using CourseMarket.Application.Common.Interfaces;
using CourseMarket.Application.Common.Models;
using CourseMarket.Application.Courses.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CourseMarket.Application.Courses.Queries;

public class GetMyCreatedCoursesQuery : IRequest<Result<List<CourseListDto>>>
{
}

public class GetMyCreatedCoursesQueryHandler : IRequestHandler<GetMyCreatedCoursesQuery, Result<List<CourseListDto>>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public GetMyCreatedCoursesQueryHandler(IApplicationDbContext context, ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<Result<List<CourseListDto>>> Handle(GetMyCreatedCoursesQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUser.UserId;

        var courses = await _context.Courses
            .Where(c => c.InstructorId == userId)
            .Include(c => c.Instructor)
            .Select(c => new CourseListDto
            {
                Id = c.Id,
                Title = c.Title,
                Description = c.Description,
                Price = c.Price,
                ImageUrl = c.ImageUrl,
                InstructorName = $"{c.Instructor.FirstName} {c.Instructor.LastName}"
            })
            .ToListAsync(cancellationToken);

        return Result<List<CourseListDto>>.Success(courses);
    }
}
