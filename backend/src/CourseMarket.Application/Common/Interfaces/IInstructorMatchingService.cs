namespace CourseMarket.Application.Common.Interfaces;

public interface IInstructorMatchingService
{
    Task<(int InstructorId, int MatchScore)> FindBestInstructorAsync(string topic, string description, CancellationToken cancellationToken = default);
}
