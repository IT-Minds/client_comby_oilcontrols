using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Security;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Roles.Queries.GetRole
{
  [AuthorizeAttribute(Domain.Enums.Action.GET_ROLES)]
  public class GetRoleQuery : IRequest<RoleDto>
  {
    public int Id { get; set; }

    public class GetRoleQueryHandler : IRequestHandler<GetRoleQuery, RoleDto>
    {
      private readonly IApplicationDbContext _context;
      private readonly IMapper _mapper;

      public GetRoleQueryHandler(IApplicationDbContext context, IMapper mapper)
      {
        _context = context;
        _mapper = mapper;
      }

      public async Task<RoleDto> Handle(GetRoleQuery request, CancellationToken cancellationToken)
      {
        var role = await _context.Roles
          .Include(x => x.Actions)
          .Where(x => x.Id == request.Id)
          .FirstOrDefaultAsync(cancellationToken);

        if (role == null)
        {
          throw new ArgumentException("No role named: " + request.Id);
        }
        return new RoleDto
        {
          Name = role.Name,
          Actions = role.Actions.Select(act => act.Action).ToList()
        };
      }
    }
  }
}