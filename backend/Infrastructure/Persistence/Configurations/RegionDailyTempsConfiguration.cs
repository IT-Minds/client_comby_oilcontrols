using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
  public class RegionDailyTempsConfiguration : IEntityTypeConfiguration<RegionDailyTemp>
  {
    public void Configure(EntityTypeBuilder<RegionDailyTemp> builder)
    {
      builder.HasOne<Region>(e => e.Region)
        .WithMany(e => e.DailyTemperatures);
    }
  }
}