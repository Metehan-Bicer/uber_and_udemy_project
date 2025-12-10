using CourseMarket.Application.Common.Interfaces;
using CourseMarket.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace CourseMarket.Infrastructure.Services;

public class InstructorMatchingService : IInstructorMatchingService
{
    private readonly IApplicationDbContext _context;
    private readonly Random _random;

    public InstructorMatchingService(IApplicationDbContext context)
    {
        _context = context;
        _random = new Random();
    }

    public async Task<(int InstructorId, int MatchScore)> FindBestInstructorAsync(
        string topic,
        string description,
        CancellationToken cancellationToken = default)
    {
        // Get all instructors
        var instructors = await _context.Users
            .Where(u => u.Role == UserRole.Instructor)
            .ToListAsync(cancellationToken);

        if (!instructors.Any())
        {
            throw new InvalidOperationException("No instructors available");
        }

        var instructorScores = new List<(int InstructorId, int Score)>();

        foreach (var instructor in instructors)
        {
            var score = 0;

            // 1. Topic Relevance (+10 points if instructor teaches related courses)
            var hasRelatedCourse = await _context.Courses
                .AnyAsync(c => c.InstructorId == instructor.Id &&
                              (c.Title.ToLower().Contains(topic.ToLower()) ||
                               c.Description.ToLower().Contains(topic.ToLower()) ||
                               topic.ToLower().Contains(c.Title.ToLower())),
                         cancellationToken);

            if (hasRelatedCourse)
            {
                score += 10;
            }

            // 2. Instructor Availability (-2 points per active assignment)
            var activeAssignmentsCount = await _context.InstructorAssignments
                .CountAsync(ia => ia.InstructorId == instructor.Id &&
                                 ia.Status == RequestStatus.Assigned,
                           cancellationToken);

            score -= (activeAssignmentsCount * 2);

            // 3. Random Factor (+0-5 for variety)
            var randomBonus = _random.Next(0, 6); // 0 to 5
            score += randomBonus;

            instructorScores.Add((instructor.Id, score));
        }

        // Select instructor with highest score
        var bestMatch = instructorScores.OrderByDescending(x => x.Score).First();

        return bestMatch;
    }
}
