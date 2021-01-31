using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
  public class LocationConfigurations : IEntityTypeConfiguration<Location>
  {
    public void Configure(EntityTypeBuilder<Location> builder)
    {
      builder.HasMany(e => e.Debtors)
        .WithOne(e => e.Location)
        .IsRequired(false);
    }
  }
}