using CourseMarket.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMarket.Infrastructure.Data.Configurations;

public class LiveLessonRequestConfiguration : IEntityTypeConfiguration<LiveLessonRequest>
{
    public void Configure(EntityTypeBuilder<LiveLessonRequest> builder)
    {
        builder.HasKey(lr => lr.Id);

        builder.Property(lr => lr.Topic)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(lr => lr.Description)
            .IsRequired()
            .HasMaxLength(1000);

        builder.Property(lr => lr.Duration)
            .IsRequired();

        builder.HasIndex(lr => lr.UserId);

        builder.HasIndex(lr => lr.Status);

        // Relationship with Assignment
        builder.HasOne(lr => lr.Assignment)
            .WithOne(ia => ia.Request)
            .HasForeignKey<InstructorAssignment>(ia => ia.RequestId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
