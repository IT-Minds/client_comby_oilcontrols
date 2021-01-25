using System;
using System.Linq;
using Newtonsoft.Json;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using AutoMapper;

namespace Application.Trucks.Commands.UpdateTruck
{
  public class UpdateTruckCommand : IRequest<TruckInfoIdDto>
  {
    public TruckInfoIdDto TruckInfo { get; set; }

    public class UpdateTruckCommandHandler : IRequestHandler<UpdateTruckCommand, TruckInfoIdDto>
    {
      private readonly IApplicationDbContext _context;
      private readonly IMapper _mapper;


      public UpdateTruckCommandHandler(IApplicationDbContext context, IMapper mapper)
      {
        _context = context;
        _mapper = mapper;
      }

      public async Task<TruckInfoIdDto> Handle(UpdateTruckCommand request, CancellationToken cancellationToken)
      {
        var truck = await _context.Trucks.FirstOrDefaultAsync(x => x.Id == request.TruckInfo.Id);
        if (truck == null)
        {
          throw new ArgumentException("No truck with Truck Id: " + request.TruckInfo.Id + ".");
        }

        var dailyState = await _context.TruckDailyStates
          .Where(x => x.TruckId == truck.Id).OrderByDescending(x => x.Date).FirstOrDefaultAsync();

        if (dailyState == null)
        {
          throw new ArgumentException("Currently no daily state registered for truck " + request.TruckInfo.Id + ", and therefor not possible to update the Starting refill-number.");
        }

        truck.TruckIdentifier = request.TruckInfo.TruckIdentifier;
        truck.Description = request.TruckInfo.Description;
        truck.TankCapacity = request.TruckInfo.TankCapacity;
        truck.Name = request.TruckInfo.Name;

        dailyState.StartRefillNumber = request.TruckInfo.RefillNumber;

        await _context.SaveChangesAsync(cancellationToken);
        return _mapper.Map<TruckInfoIdDto>(truck);
      }
    }
  }
}
