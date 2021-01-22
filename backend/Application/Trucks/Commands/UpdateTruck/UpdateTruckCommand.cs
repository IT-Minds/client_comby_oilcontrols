using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Trucks.Commands.UpdateTruck
{
  public class UpdateTruckCommand : IRequest<string>
  {
    public string TruckIdentifier { get; set; }
    public string NewTruckIdentifier { get; set; }
    public string Description { get; set; }
    public double TankCapacity { get; set; }
    public int StartRefillNumber { get; set; }
    public string Name { get; set; }
    public class UpdateTruckCommandHandler : IRequestHandler<UpdateTruckCommand, string>
    {
      private readonly IApplicationDbContext _context;

      public UpdateTruckCommandHandler(IApplicationDbContext context)
      {
        _context = context;
      }

      public async Task<string> Handle(UpdateTruckCommand request, CancellationToken cancellationToken)
      {
        var truck = await _context.Trucks
          .Include(x => x.DailyStates)
          .FirstOrDefaultAsync(x => x.TruckIdentifier == request.TruckIdentifier);
        if (truck == null)
        {
          throw new ArgumentException("No truck with Truck Id: " + request.TruckIdentifier + ".");
        }

        truck.TruckIdentifier = (request.NewTruckIdentifier == null || request.NewTruckIdentifier.Equals("")) ? request.TruckIdentifier : request.NewTruckIdentifier;
        truck.Description = request.Description;
        truck.TankCapacity = request.TankCapacity;
        truck.Name = request.Name;
        var dailyState = truck.DailyStates.OrderByDescending(x => x.Date).FirstOrDefault();
        if (dailyState == null)
        {
          throw new ArgumentException("Currently no daily state registered for truck " + request.TruckIdentifier + ", and therefor not possible to update the Starting refill-number.");
        }
        dailyState.StartRefillNumber = request.StartRefillNumber;

        await _context.SaveChangesAsync(cancellationToken);
        return truck.TruckIdentifier;
      }
    }
  }
}