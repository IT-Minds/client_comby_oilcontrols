using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
  public class StreetConfiguration : IEntityTypeConfiguration<Street>
  {
    public void Configure(EntityTypeBuilder<Street> builder)
    {
      builder.HasOne<Region>(e => e.Region)
        .WithMany(e => e.Streets)
        .IsRequired(true);
    }
  }
}