

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Security;
using Application.Common.Services;
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
      private readonly SynchronizeDebtorService _synchronizeDebtorService;

      public GetLocationRequiringRefillHandler(IApplicationDbContext context, IMapper mapper, IUniContaService uniContaService, SynchronizeDebtorService synchroniceDebtorService)
      {
        _context = context;
        _mapper = mapper;
        _synchronizeDebtorService = synchroniceDebtorService;
      }

      public async Task<List<LocationRefillDto>> Handle(GetLocationRequiringRefill request, CancellationToken cancellationToken)
      {
        var refillEntities = _context.AssignedRefills
          .Include(r => r.Truck)
          .Include(r => r.Location)
            .ThenInclude(l => l.FuelTank)
          .Where(r => r.TruckId == request.TruckId);
        var refillDtos = await refillEntities
          .ProjectTo<LocationRefillDto>(_mapper.ConfigurationProvider)
          .ToListAsync();

        var result = await _synchronizeDebtorService.SyncroniceDebtor();

        foreach (var (a, b) in result)
        {
          var debtorsRefills = refillEntities.Where(x => x.Location.Debtors.Where(x => x.DebtorId == b.Id).Count() != 0);

          foreach (var entity in debtorsRefills)
          {
            var dtos = refillDtos.Where(x => x.LocationId == entity.Location.Id);
            foreach (var dto in dtos)
            {
              dto.DebtorBlocked = a.Blocked;
            }
          }
        }

        return refillDtos;
      }
    }
  }
}
