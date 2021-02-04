using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Security;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Trucks.Queries.GetTruckInfo
{
  [AuthorizeAttribute(Domain.Enums.Action.GET_TRUCK)]
  public class GetTruckInfoQuery : IRequest<TruckInfoDetailsDto>
  {
    public int Id { get; set; }

    public class GetTruckInfoQueryHandler : IRequestHandler<GetTruckInfoQuery, TruckInfoDetailsDto>
    {
      private readonly IApplicationDbContext _context;
      private readonly IMapper _mapper;

      public GetTruckInfoQueryHandler(IApplicationDbContext context, IMapper mapper)
      {
        _context = context;
        _mapper = mapper;
      }
      public async Task<TruckInfoDetailsDto> Handle(GetTruckInfoQuery request, CancellationToken cancellationToken)
      {
        var truck = await _context.Trucks
          .Include(x => x.DailyStates)
            .ThenInclude(x => x.TruckRefills)
          .Include(t => t.Route)
            .ThenInclude(r => r.Refills)
          .Where(x => x.Id == request.Id)
          .ProjectTo<TruckInfoDetailsDto>(_mapper.ConfigurationProvider)
          .FirstOrDefaultAsync();

        if (truck == null)
        {
          throw new ArgumentException("Invalid Truck Identifier: " + request.Id);
        }
        return truck;
      }
    }
  }
}
