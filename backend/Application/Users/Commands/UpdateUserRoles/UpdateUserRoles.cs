using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Security;
using AutoMapper;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace Application.Users.Commands.UpdateUserRole
{
  [AuthorizeAttribute(Domain.Enums.Action.UPDATE_USER)]
  public class UpdateUserRolesCommand : IRequest<UserIdDto>
  {
    [JsonIgnore]
    public int UserId { get; set; }
    public string Role { get; set; }

    public class UpdateUserRolesCommandHandler : IRequestHandler<UpdateUserRolesCommand, UserIdDto>
    {
      private readonly IApplicationDbContext _context;
      private readonly IMapper _mapper;

      public UpdateUserRolesCommandHandler(IApplicationDbContext context, IMapper mapper)
      {
        _context = context;
        _mapper = mapper;
      }

      public async Task<UserIdDto> Handle(UpdateUserRolesCommand request, CancellationToken cancellationToken)
      {
        var userEntity = await _context.Users
          .Include(x => x.Roles)
          .ThenInclude(x => x.Role)
          .FirstOrDefaultAsync(x => x.Id == request.UserId, cancellationToken);
        if (userEntity == null)
        {
          throw new ArgumentException("Username doesn't exist");
        }

        var roleEntity = await _context.Roles
          .Where(x => x.Name.Equals(request.Role))
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
          userRole.Role = roleEntity;
          _context.UserRoles.Update(userRole);
        }
        else
        {
          userRole = new UserRole
          {
            User = userEntity,
            Role = roleEntity
          };
          _context.UserRoles.Add(userRole);
        }

        return _mapper.Map<UserIdDto>(userEntity);
      }
    }
  }
}
