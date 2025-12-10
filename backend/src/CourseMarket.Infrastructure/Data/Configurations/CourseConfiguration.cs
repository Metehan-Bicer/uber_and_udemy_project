using CourseMarket.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMarket.Infrastructure.Data.Configurations;

public class CourseConfiguration : IEntityTypeConfiguration<Course>
{
    public void Configure(EntityTypeBuilder<Course> builder)
    {
        builder.HasKey(c => c.Id);

        builder.Property(c => c.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(c => c.Description)
            .IsRequired()
            .HasMaxLength(2000);

        builder.Property(c => c.Price)
            .IsRequired()
            .HasPrecision(18, 2);

        builder.Property(c => c.ImageUrl)
            .HasMaxLength(500);

        builder.HasIndex(c => c.InstructorId);

        builder.HasIndex(c => c.IsActive);

        // Relationship with Instructor is configured in UserConfiguration
    }
}
