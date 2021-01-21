using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
using global::Application.Common.Interfaces;
using Application.Common.Exceptions;
using Domain.Entities;

namespace Application.Locations.Commands.CreateLocation
{
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
    //TODO Estiamte consumption isn't currently in the data model. But is added with CO-95.
    public double EstimateConsumption { get; set; }

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
          Type = request.TankType,
          TankCapacity = request.TankCapacity,
          TankNumber = request.TankNumber,
          MinimumFuelAmount = request.MinimumFuelAmount,
          //TODO Estiamte consumption isn't currently in the data model. But is added with CO-95.
        };
        _context.FuelTanks.Add(tank);

        var location = new Location
        {
          Address = request.Address,
          Comments = request.Comment,
          Schedule = request.Refillschedule,
          RegionId = request.RegionId,
          FuelTankId = tank.Id
        };
        _context.Locations.Add(location);

        await _context.SaveChangesAsync(cancellationToken);
        return location.Id;
      }
    }
  }
}