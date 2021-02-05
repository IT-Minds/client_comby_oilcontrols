using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using AutoMapper;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Roles.Commands.UpdateRole
{
  public class UpdateRoleCommand : IRequest<RoleIdDto>
  {
    public RoleDto Role { get; set; }

    public class UpdateRoleCommandHandler : IRequestHandler<UpdateRoleCommand, RoleIdDto>
    {
      private readonly IApplicationDbContext _context;
      private readonly IMapper _mapper;

      public UpdateRoleCommandHandler(IApplicationDbContext context, IMapper mapper)
      {
        _context = context;
        _mapper = mapper;
      }

      public async Task<RoleIdDto> Handle(UpdateRoleCommand request, CancellationToken cancellationToken)
      {
        var roleEntity = _context.Roles.Include(x => x.Actions).Where(x => x.Name.Equals(request.Role.Name)).FirstOrDefault();
        if (roleEntity == null)
        {
          throw new ArgumentException("No role with name: " + request.Role.Name);
        }
        _context.Roles.Update(roleEntity);

        if (request.Role.Actions == null)
        {
          request.Role.Actions = new List<Domain.Enums.Action>();
        }

        roleEntity.Actions = new List<RoleAction>();
        foreach (Domain.Enums.Action act in request.Role.Actions)
        {
          roleEntity.Actions.Add(new RoleAction { Action = act, RoleId = roleEntity.Id });
        }
        await _context.SaveChangesAsync(cancellationToken);
        return new RoleIdDto { Name = roleEntity.Name, Actions = request.Role.Actions, Id = roleEntity.Id };
      }
    }
  }
}