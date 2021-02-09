using Domain.Entities;
using Domain.Entities.Refills;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
  public class CouponConfiguration : IEntityTypeConfiguration<Coupon>
  {
    public void Configure(EntityTypeBuilder<Coupon> builder)
    {
      builder.HasOne(x => x.Refill).WithOne(y => y.Coupon).HasForeignKey<CompletedRefill>(x => x.CouponId).IsRequired(false);

      builder
        .HasIndex(c => c.CouponNumber)
        .IsUnique();
    }
  }
}
