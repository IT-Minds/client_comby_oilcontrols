using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Roles.Queries.GetRole
{
  public class GetRoleQuery : IRequest<RoleDto>
  {
    public string Name { get; set; }

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
          .Where(x => x.Name.Equals(request.Name))
          .FirstOrDefaultAsync(cancellationToken);

        if (role == null)
        {
          throw new ArgumentException("No role named: " + request.Name);
        }
        var acts = role.Actions.Select(act => act.Action).ToList();
        return new RoleDto { Name = request.Name, Actions = acts };
      }
    }
  }
}