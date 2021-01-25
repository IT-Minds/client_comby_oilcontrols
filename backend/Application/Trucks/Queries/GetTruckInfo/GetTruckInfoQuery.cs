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
  public class GetTruckInfoQuery : IRequest<TruckInfoDto>
  {
    public int Id { get; set; }

    public class GetTruckInfoQueryHandler : IRequestHandler<GetTruckInfoQuery, TruckInfoDto>
    {
      private readonly IApplicationDbContext _context;
      private readonly IMapper _mapper;

      public GetTruckInfoQueryHandler(IApplicationDbContext context, IMapper mapper)
      {
        _context = context;
        _mapper = mapper;
      }
      public async Task<TruckInfoDto> Handle(GetTruckInfoQuery request, CancellationToken cancellationToken)
      {
        var truck = await _context.Trucks
          .Where(x => x.Id == request.Id)
          .ProjectTo<TruckInfoDto>(_mapper.ConfigurationProvider)
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
