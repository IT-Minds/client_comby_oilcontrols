using System.Linq;
using Application.Common.Options;
using Application.Security;
using Domain.Entities;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Web.Options;

namespace Web
{
  public static class SuperUser
  {
    public static void SetupSuperUser(ApplicationDbContext context, IOptions<SuperUserOptions> options, IOptions<HashingOptions> hashingOptions)
    {

      var username = options.Value.Username;

      var pass = new PasswordHasher(hashingOptions).Hash(options.Value.Username);

      var superUser = context.Users
        .Include(x => x.Roles)
        .Where(x => x.Username.Equals(username))
        .FirstOrDefault();

      if (superUser != null)
      {
        context.UserRoles.RemoveRange(context.UserRoles.Where(x => x.UserId == superUser.Id));
        context.Users.Remove(superUser);
      }
      var superUserRole = context.Roles
        .Include(x => x.Actions)
        .Where(x => x.Name.Equals(username))
        .FirstOrDefault();
      if (superUserRole != null)
      {
        context.RoleActions.RemoveRange(context.RoleActions.Where(x => x.RoleId == superUserRole.Id));
        context.Roles.Remove(superUserRole);
      }

      superUser = new User
      {
        Username = username,
        Password = pass
      };
      context.Users.Add(superUser);

      superUserRole = new Role
      {
        Name = username
      };
      context.Roles.Add(superUserRole);

      context.UserRoles.Add(new UserRole { User = superUser, Role = superUserRole });

      var allActions = System.Enum.GetValues<Domain.Enums.Action>().ToList();
      foreach (var action in allActions)
      {
        context.Add(new RoleAction { Role = superUserRole, Action = action });
      }

      context.SaveChanges();
    }
  }
}