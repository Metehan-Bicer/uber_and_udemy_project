using CourseMarket.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMarket.Infrastructure.Data.Configurations;

public class InstructorAssignmentConfiguration : IEntityTypeConfiguration<InstructorAssignment>
{
    public void Configure(EntityTypeBuilder<InstructorAssignment> builder)
    {
        builder.HasKey(ia => ia.Id);

        builder.Property(ia => ia.MatchScore)
            .IsRequired();

        builder.HasIndex(ia => ia.RequestId);

        builder.HasIndex(ia => ia.InstructorId);

        // Relationships configured in other configurations
    }
}
