using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Domain.Enums;
using global::Application.Common.Interfaces;
using Domain.Entities;
using Application.Common.Security;

namespace Application.Locations.Commands.CreateLocation
{
  [AuthorizeAttribute(Domain.Enums.Action.CREATE_LOCATION)]
  public class CreateLocationCommand : IRequest<int>
  {
    public string Address { get; set; }
    public string Comment { get; set; }
    public int RegionId { get; set; }
    public RefillSchedule Refillschedule { get; set; }
    public TankType TankType { get; set; }
    public int TankNumber { get; set; }
    public double TankCapacity { get; set; }
    public double MinimumFuelAmount { get; set; }
    public double EstimateConsumption { get; set; }
    public int DaysBetweenRefills { get; set; }
    public FuelType FuelType { get; set; }

    public class CreateLocationCommandHandler : IRequestHandler<CreateLocationCommand, int>
    {
      private readonly IApplicationDbContext _context;

      public CreateLocationCommandHandler(IApplicationDbContext context)
      {
        _context = context;
      }

      public async Task<int> Handle(CreateLocationCommand request, CancellationToken cancellationToken)
      {
        var tank = new FuelTank
        {
          TankType = request.TankType,
          TankCapacity = request.TankCapacity,
          TankNumber = request.TankNumber,
          MinimumFuelAmount = request.MinimumFuelAmount,
          FuelType = request.FuelType
        };
        _context.FuelTanks.Add(tank);

        var location = new Location
        {
          Address = request.Address,
          Comments = request.Comment,
          Schedule = request.Refillschedule,
          RegionId = request.RegionId,
          FuelTank = tank,
          EstimateFuelConsumption = request.EstimateConsumption,
          DaysBetweenRefills = request.DaysBetweenRefills
        };
        _context.Locations.Add(location);

        await _context.SaveChangesAsync(cancellationToken);
        return location.Id;
      }
    }
  }
}
