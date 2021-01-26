using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
  public class LocationConfigurations : IEntityTypeConfiguration<Location>
  {
    public void Configure(EntityTypeBuilder<Location> builder)
    {
      builder.HasOne<Region>(e => e.Region)
        .WithMany(e => e.Locations)
        .IsRequired(false);
      builder.HasOne<Debtor>(e => e.Debtor)
        .WithMany(e => e.Locations);
      builder.HasOne<Debtor>(e => e.UpcomingDebtor)
        .WithMany(e => e.UpcomingLocations)
        .IsRequired(false);
      builder.HasOne<Debtor>(e => e.BaseDebtor)
        .WithMany(e => e.AdministeredLocations)
        .IsRequired(false);
    }
  }
}