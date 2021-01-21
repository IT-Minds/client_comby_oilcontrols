using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using MediatR;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Application.Common.Exceptions;

namespace Application.Locations.Commands.UpdateLocationMetaData
{
  public class UpdateLocationMetaDataCommand : IRequest<int>
  {
    public int LocationId { get; set; }
    public string Address { get; set; }
    public string Comment { get; set; }
    public RefillSchedule Refillschedule { get; set; }
    public TankType TankType { get; set; }
    public int TankNumber { get; set; }
    public double TankCapacity { get; set; }
    public double MinimumFuelAmount { get; set; }
    //TODO Estiamte consumption isn't currently in the data model, but this is also a calculated property right?
    public double EstimateConsumption { get; set; }

    public class UpdateLocationMetaDataCommandHandler : IRequestHandler<UpdateLocationMetaDataCommand, int>
    {
      private readonly IApplicationDbContext _context;

      public UpdateLocationMetaDataCommandHandler(IApplicationDbContext context)
      {
        _context = context;
      }

      public async Task<int> Handle(UpdateLocationMetaDataCommand request, CancellationToken cancellationToken)
      {
        var location = await _context.Locations
          .Include(x => x.FuelTank)
          .FirstOrDefaultAsync(x => x.Id == request.LocationId);

        if (location == null)
        {
          throw new NotFoundException(nameof(location), request.LocationId);
        }
        //TODO: This is not necessarily what we want to do here.
        if (location.FuelTank == null)
        {
          throw new NotFoundException(nameof(location.FuelTank), request.LocationId);
        }

        location.Address = request.Address;
        location.Comments = request.Comment;
        location.Schedule = request.Refillschedule;

        var tank = location.FuelTank;
        tank.Type = request.TankType;
        tank.TankNumber = request.TankNumber;
        tank.TankCapacity = request.TankCapacity;
        tank.MinimumFuelAmount = request.MinimumFuelAmount;

        await _context.SaveChangesAsync(cancellationToken);
        return request.LocationId;
      }
    }
  }
}