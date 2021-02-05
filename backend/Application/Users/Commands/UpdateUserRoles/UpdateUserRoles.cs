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
        var userEntity = await _context.Users
          .Include(x => x.Roles)
          .ThenInclude(x => x.Role)
          .Where(x => x.Username.Equals(request.User.Username))
          .FirstOrDefaultAsync(cancellationToken);
        if (userEntity == null)
        {
          throw new ArgumentException("Username doesn't exist");
        }

        var roleEntity = await _context.Roles
          .Where(x => x.Name.Equals(request.User.Role))
          .FirstOrDefaultAsync(cancellationToken);
        if (roleEntity == null)
        {
          throw new ArgumentException("No such role.");
        }

        var userRole = await _context.UserRoles
          .Where(x => x.UserId == userEntity.Id)
          .FirstOrDefaultAsync(cancellationToken);

        if (userRole != null)
        {
          _context.UserRoles.Remove(userRole);
          await _context.SaveChangesAsync(cancellationToken);
        }
        userRole = new UserRole
        {
          User = userEntity,
          Role = roleEntity
        };

        _context.UserRoles.Update(userRole);
        await _context.SaveChangesAsync(cancellationToken);
        return request.User;
      }

    }
  }
}