using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;
using MediatR;

namespace Application.Roles.Commands.CreateRole
{
  public class CreateRoleCommand : IRequest<RoleIdDto>
  {
    public RoleDto Role { get; set; }

    public class CreateRoleCommandHandler : IRequestHandler<CreateRoleCommand, RoleIdDto>
    {
      private readonly IApplicationDbContext _context;
      private readonly IMapper _mapper;

      public CreateRoleCommandHandler(IApplicationDbContext context, IMapper mapper)
      {
        _context = context;
        _mapper = mapper;
      }

      public async Task<RoleIdDto> Handle(CreateRoleCommand request, CancellationToken cancellationToken)
      {
        if(request.Role.Actions == null)
        {
          request.Role.Actions = new List<Domain.Enums.Action>();
        }
        var role = new Role
        {
          Name = request.Role.Name,
        };
        _context.Roles.Add(role);

        foreach (Domain.Enums.Action act in request.Role.Actions)
        {
          _context.RoleActions.Add(new RoleAction { Action = act, RoleId = role.Id });
        }
         await _context.SaveChangesAsync(cancellationToken);
        return new RoleIdDto { Name = request.Role.Name, Actions = request.Role.Actions, Id = role.Id };
      }
    }
  }
}