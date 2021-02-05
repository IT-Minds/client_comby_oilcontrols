using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Users.UpdateUser;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Users.Commands.UpdateUser
{
  public class UpdateUserRolesCommand : IRequest<UserRoleDto>
  {
    public UserRoleDto User { get; set; }

    public class UpdateUserRolesCommandHandler : IRequestHandler<UpdateUserRolesCommand, UserRoleDto>
    {
      private readonly IApplicationDbContext _context;

      public UpdateUserRolesCommandHandler(IApplicationDbContext context)
      {
        _context = context;
      }

      public async Task<UserRoleDto> Handle(UpdateUserRolesCommand request, CancellationToken cancellationToken)
      {
        var entity = await _context.Users
          .Include(x => x.Roles)
          .ThenInclude(x => x.Role)
          .Where(x => x.Username.Equals(request.User.Username))
          .FirstOrDefaultAsync(cancellationToken);

        if (entity == null)
        {
          throw new ArgumentException("Username doesn't exist");
        }

        _context.UserRoles.RemoveRange(_context.UserRoles.Where(x => x.UserId == entity.Id));

        foreach (var role in request.User.Roles)
        {
          var roleEntity = await _context.Roles.Where(x => x.Name.Equals(role)).FirstOrDefaultAsync(cancellationToken);
          if (roleEntity == null)
          {
            throw new ArgumentException("Role: " + role + " doesn't exist.");
          }

          _context.UserRoles.Add(new UserRole { UserId = entity.Id, RoleId = roleEntity.Id });
        }
        await _context.SaveChangesAsync(cancellationToken);
        return request.User;
      }

    }
  }
}