using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
  public class ExampleEntityConfiguration : IEntityTypeConfiguration<ExampleEntity>
  {
    public void Configure(EntityTypeBuilder<ExampleEntity> builder)
    {
      builder.Property(e => e.Name)
          .HasMaxLength(200)
          .IsRequired();

      builder.HasOne<ExampleEntityList>(e => e.ExampleEntityList)
          .WithMany(e => e.ExampleEntities)
          .IsRequired(false);
    }
  }
}
