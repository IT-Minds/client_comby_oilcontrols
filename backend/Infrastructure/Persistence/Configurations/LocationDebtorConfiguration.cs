using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
  public class LocationDebtorConfiguration : IEntityTypeConfiguration<LocationDebtor>
  {
    public void Configure(EntityTypeBuilder<LocationDebtor> builder)
    {
      // builder.HasKey(e => new { e.DebtorId, e.LocationId });

      builder.HasOne(e => e.Debtor)
        .WithMany(e => e.Locations)
        .IsRequired(true);
      builder.HasOne(e => e.Location)
        .WithMany(e => e.Debtors)
        .IsRequired(true);
      builder.HasIndex(e => new { e.LocationId, e.DebtorId, e.Type }).IsUnique();
    }
  }
}
