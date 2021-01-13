using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
  public class RegionConfiguration : IEntityTypeConfiguration<Region>
  {
    public void Configure(EntityTypeBuilder<Region> builder)
    {
      builder.HasMany<Location>(e => e.Locations)
        .WithOne(e => e.Region)
        .IsRequired(false);

      builder.HasMany<RegionDailyTemp>(e => e.DailyTemperatures)
       .WithOne(e => e.Region)
       .IsRequired(true);
    }
  }
}