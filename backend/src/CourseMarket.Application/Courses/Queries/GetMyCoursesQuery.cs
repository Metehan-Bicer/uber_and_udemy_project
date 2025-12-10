using CourseMarket.Application.Common.Interfaces;
using CourseMarket.Application.Common.Models;
using CourseMarket.Application.Courses.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CourseMarket.Application.Courses.Queries;

public class GetMyCoursesQuery : IRequest<Result<List<CourseListDto>>>
{
}

public class GetMyCoursesQueryHandler : IRequestHandler<GetMyCoursesQuery, Result<List<CourseListDto>>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public GetMyCoursesQueryHandler(IApplicationDbContext context, ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<Result<List<CourseListDto>>> Handle(GetMyCoursesQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUser.UserId;

        var courses = await _context.Purchases
            .Where(p => p.UserId == userId)
            .Include(p => p.Course)
            .ThenInclude(c => c.Instructor)
            .Select(p => new CourseListDto
            {
                Id = p.Course.Id,
                Title = p.Course.Title,
                Description = p.Course.Description,
                Price = p.Course.Price,
                ImageUrl = p.Course.ImageUrl,
                InstructorName = $"{p.Course.Instructor.FirstName} {p.Course.Instructor.LastName}"
            })
            .ToListAsync(cancellationToken);

        return Result<List<CourseListDto>>.Success(courses);
    }
}
