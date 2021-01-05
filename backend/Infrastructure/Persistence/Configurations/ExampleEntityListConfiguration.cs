using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
  public class ExampleEntityListConfiguration : IEntityTypeConfiguration<ExampleEntityList>
  {
    public void Configure(EntityTypeBuilder<ExampleEntityList> builder)
    {
      builder.Property(e => e.Name)
          .HasMaxLength(200)
          .IsRequired();

      builder.HasMany<ExampleEntity>(e => e.ExampleEntities)
          .WithOne(e => e.ExampleEntityList)
          .IsRequired(false);
    }
  }
}
