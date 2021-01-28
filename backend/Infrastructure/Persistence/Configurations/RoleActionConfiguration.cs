using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
  public class RoleActionConfiguration : IEntityTypeConfiguration<RoleAction>
  {
    public void Configure(EntityTypeBuilder<RoleAction> builder)
    {
      builder.HasKey(e => new { e.RoleId, e.Action });
      builder.HasOne<Role>(e => e.Role)
        .WithMany(e => e.Actions)
        .IsRequired(true);
    }

  }
}
