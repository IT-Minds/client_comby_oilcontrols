using Domain.Entities;
using Domain.Entities.Refills;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
  public class OrderedRefillConfigurations : IEntityTypeConfiguration<OrderedRefill>
  {
    public void Configure(EntityTypeBuilder<OrderedRefill> builder)
    {
      builder.ToTable("Refills");

      builder.HasDiscriminator<RefillState>("RefillState")
        .HasValue<OrderedRefill>(RefillState.ORDERED)
        .HasValue<AssignedRefill>(RefillState.ASSIGNED)
        .HasValue<CompletedRefill>(RefillState.COMPLETED);

    }
  }

  // public class AssignedRefillConfigurations : IEntityTypeConfiguration<AssignedRefill>
  // {
  //   public void Configure(EntityTypeBuilder<AssignedRefill> builder)
  //   {

  //   }
  // }

  // public class CompeltedRefillConfigurations : IEntityTypeConfiguration<CompletedRefill>
  // {
  //   public void Configure(EntityTypeBuilder<CompletedRefill> builder)
  //   {
  //   }
  // }
}
