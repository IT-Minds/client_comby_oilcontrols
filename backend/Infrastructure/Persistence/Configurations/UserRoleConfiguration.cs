using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
  public class UserRoleConfiguration : IEntityTypeConfiguration<UserRole>
  {
    public void Configure(EntityTypeBuilder<UserRole> builder)
    {
      // builder.HasKey(e => new { e.UserId, e.RoleId });
      builder.HasOne<Role>(e => e.Role)
        .WithMany(e => e.Users)
        .IsRequired(false);
      builder.HasOne<User>(e => e.User)
        .WithMany(e => e.Roles)
        .IsRequired(true);
    }
  }
}
