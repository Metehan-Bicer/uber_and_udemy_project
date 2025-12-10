using CourseMarket.Application.Common.Interfaces;
using CourseMarket.Application.Common.Models;
using CourseMarket.Application.Courses.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CourseMarket.Application.Courses.Queries;

public class GetAllCoursesQuery : IRequest<Result<PaginatedCoursesDto>>
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? Search { get; set; }
}

public class GetAllCoursesQueryHandler : IRequestHandler<GetAllCoursesQuery, Result<PaginatedCoursesDto>>
{
    private readonly IApplicationDbContext _context;

    public GetAllCoursesQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<PaginatedCoursesDto>> Handle(GetAllCoursesQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Courses
            .Include(c => c.Instructor)
            .Where(c => c.IsActive)
            .AsQueryable();

        // Apply search filter
        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            query = query.Where(c =>
                c.Title.Contains(request.Search) ||
                c.Description.Contains(request.Search));
        }

        var totalCount = await query.CountAsync(cancellationToken);

        var courses = await query
            .OrderByDescending(c => c.CreatedAt)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
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

        var result = new PaginatedCoursesDto
        {
            Items = courses,
            TotalCount = totalCount,
            Page = request.Page,
            PageSize = request.PageSize
        };

        return Result<PaginatedCoursesDto>.Success(result);
    }
}
