using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Options;
using Application.Security;
using Domain.Entities;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Web.Options;

namespace Web.Services
{
  public class SuperAdminService
  {
    private readonly ApplicationDbContext _context;
    private readonly SuperUserOptions _options;
    private readonly HashingOptions _hashingOptions;
    private readonly IPasswordHasher _passwordHasher;

    public SuperAdminService(ApplicationDbContext context, IOptions<SuperUserOptions> options, IOptions<HashingOptions> hashingOptions, IPasswordHasher passwordHasher)
    {
      _context = context;
      _options = options.Value;
      _hashingOptions = hashingOptions.Value;

      _passwordHasher = passwordHasher;
    }

    public void SetupSuperUser()
    {

      var superRole = _context.Roles
        .Include(x => x.Actions)
        .Where(x => x.Name.Equals("SuperAdmin"))
        .FirstOrDefault();

      if (superRole == null)
      {
        superRole = new Role
        {
          Name = "SuperAdmin"
        };
        _context.Roles.Add(superRole);
      }

      var username = _options.Username;
      var pass = _passwordHasher.Hash(_options.Password);
      var superUser = _context.Users
        .Include(x => x.Roles)
        .Where(x => x.Username.Equals(username))
        .FirstOrDefault();

      if (superUser == null)
      {
        superUser = new User
        {
          Username = username,
          Password = pass
        };
        _context.Users.Add(superUser);
      }

      var superUserRole = _context.UserRoles.Where(x => x.UserId == superUser.Id).FirstOrDefault();

      if (superUserRole == null) {
        superUserRole = new UserRole
        {
          User = superUser,
          Role = superRole
        };
        _context.UserRoles.Add(superUserRole);
      }

      var allActions = System.Enum.GetValues<Domain.Enums.Action>().ToList();
      var actions =  _context.RoleActions.Where(x => x.RoleId == superRole.Id).ToList();
      foreach (var action in allActions)
      {
        var existingActions = actions.FirstOrDefault(x => x.Action == action);
        if (existingActions == null)
          _context.Add(new RoleAction { Role = superRole, Action = action });
      }

      _context.SaveChanges();
    }
  }

}
