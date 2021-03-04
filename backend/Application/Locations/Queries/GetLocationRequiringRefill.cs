

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Security;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Entities.Refills;
using Domain.EntityExtensions;
using Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Locations.Queries
{
  [AuthorizeAttribute(Domain.Enums.Action.GET_LOCATION)]
  public class GetLocationRequiringRefill : IRequest<List<LocationRefillDto>>
  {
    public int TruckId { get; set; }
    public class GetLocationRequiringRefillHandler : IRequestHandler<GetLocationRequiringRefill, List<LocationRefillDto>>
    {
      private readonly IApplicationDbContext _context;
      private readonly IMapper _mapper;

      public GetLocationRequiringRefillHandler(IApplicationDbContext context, IMapper mapper)
      {
        _context = context;
        _mapper = mapper;
      }

      public async Task<List<LocationRefillDto>> Handle(GetLocationRequiringRefill request, CancellationToken cancellationToken)
      {
        var refillDtos = await _context.AssignedRefills
          .Include(r => r.Truck)
          .Include(r => r.Location)
            .ThenInclude(l => l.FuelTank)
          .Include(r => r.Location)
            .ThenInclude(l => l.Debtors)
              .ThenInclude(l => l.Debtor)
          .Where(x => x.Location.InactiveSince == null || x.Location.InactiveSince >= DateTime.Now)
          .Where(r => r.TruckId == request.TruckId)
          .Where(r => r.RefillState == RefillState.ASSIGNED)
          .ProjectTo<LocationRefillDto>(_mapper.ConfigurationProvider)
          .ToListAsync();

        return refillDtos;
      }
    }
  }
}
