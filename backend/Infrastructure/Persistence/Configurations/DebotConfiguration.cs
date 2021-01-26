using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
  public class DebtorConfiguration : IEntityTypeConfiguration<Debtor>
  {
    public void Configure(EntityTypeBuilder<Debtor> builder)
    {
      builder.HasMany<Location>(e => e.Locations)
        .WithOne(e => e.Debtor)
        .IsRequired(false);
    }
  }
}