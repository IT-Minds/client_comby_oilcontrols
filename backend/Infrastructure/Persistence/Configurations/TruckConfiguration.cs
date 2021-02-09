using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
  public class TruckConfiguration : IEntityTypeConfiguration<Truck>
  {
    public void Configure(EntityTypeBuilder<Truck> builder)
    {
      builder.HasMany(e => e.Refills)
        .WithOne(e => e.Truck)
        .HasForeignKey(x => x.TruckId)
        .OnDelete(DeleteBehavior.NoAction)
        .IsRequired(true);

      builder.Ignore(x => x.CompletedRefills);
    }
  }
}
