using CourseMarket.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMarket.Infrastructure.Data.Configurations;

public class PurchaseConfiguration : IEntityTypeConfiguration<Purchase>
{
    public void Configure(EntityTypeBuilder<Purchase> builder)
    {
        builder.HasKey(p => p.Id);

        builder.Property(p => p.Amount)
            .IsRequired()
            .HasPrecision(18, 2);

        builder.Property(p => p.StripePaymentIntentId)
            .IsRequired()
            .HasMaxLength(255);

        builder.HasIndex(p => p.StripePaymentIntentId);

        builder.HasIndex(p => p.UserId);

        builder.HasIndex(p => p.CourseId);

        // Relationships
        builder.HasOne(p => p.Course)
            .WithMany(c => c.Purchases)
            .HasForeignKey(p => p.CourseId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
