using CourseMarket.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CourseMarket.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<User> Users { get; }
    DbSet<Course> Courses { get; }
    DbSet<Purchase> Purchases { get; }
    DbSet<LiveLessonRequest> LiveLessonRequests { get; }
    DbSet<InstructorAssignment> InstructorAssignments { get; }
    DbSet<Notification> Notifications { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
