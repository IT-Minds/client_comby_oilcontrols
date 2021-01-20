using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Trucks.Queries.GetTruckInfo
{
  public class GetNewestTruckInfoQuery : IRequest<TruckInfoDto>
  {
    public int TruckId { get; set; }
    public class GetNewestTruckInfoQueryHandler : IRequestHandler<GetNewestTruckInfoQuery, TruckInfoDto>
    {
      private readonly IApplicationDbContext _context;
      private readonly IMapper _mapper;

      public GetNewestTruckInfoQueryHandler(IApplicationDbContext context, IMapper mapper)
      {
        _context = context;
        _mapper = mapper;
      }
      public async Task<TruckInfoDto> Handle(GetNewestTruckInfoQuery request, CancellationToken cancellationToken)
      {
        var trucks = await _context.Trucks
          .Include(x => x.DailyStates)
          .ThenInclude(x => x.TruckRefills)
          .Where(x => x.Id == request.TruckId)
          .ProjectTo<TruckInfoDto>(_mapper.ConfigurationProvider)
          .ToListAsync(cancellationToken);

        if (trucks == null || trucks.Count() == 0)
        {
          throw new ArgumentException("Invalid Region ID: " + request.TruckId);
        }
        var truck = trucks.FirstOrDefault();
        return truck;
      }
    }
  }
}