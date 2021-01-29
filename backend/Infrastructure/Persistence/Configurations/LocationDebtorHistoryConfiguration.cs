using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
  public class LocationDebtorHistoryConfiguration : IEntityTypeConfiguration<LocationDebtorHistory>
  {
    public void Configure(EntityTypeBuilder<LocationDebtorHistory> builder)
    {
      builder.HasKey(e => new {e.LocationId, e.DebtorId});
    }
  }
}