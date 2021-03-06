using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using MediatR;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Application.Common.Exceptions;
using Newtonsoft.Json;
using Application.Common.Security;

namespace Application.Locations.Commands.UpdateLocationMetaData
{
  [AuthorizeAttribute(Domain.Enums.Action.UPDATE_LOCATION)]
  public class UpdateLocationMetaDataCommand : IRequest<int>
  {
    [JsonIgnore]
    public int Id { get; set; }
    public LocationDetailsDto Data { get; set; }

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
          .FirstOrDefaultAsync(x => x.Id == request.Id);

        if (location == null)
        {
          throw new NotFoundException(nameof(location), request.Id);
        }
        //TODO: This is not necessarily what we want to do here.
        if (location.FuelTank == null)
        {
          throw new NotFoundException(nameof(location.FuelTank), request.Id);
        }

        location.Address = request.Data.Address;
        location.AddressExtra = request.Data.AddressExtra;
        location.Comments = request.Data.Comments;
        location.Schedule = request.Data.Schedule;
        location.EstimateFuelConsumption = request.Data.EstimateFuelConsumption;
        location.DaysBetweenRefills = request.Data.DaysBetweenRefills;
        location.TankType = request.Data.TankType;
        location.TankNumber = request.Data.BSTNumber;
        location.InactiveSince = request.Data.InactiveSince;

        var tank = location.FuelTank;
        tank.TankCapacity = request.Data.TankCapacity;
        tank.MinimumFuelAmount = request.Data.MinimumFuelAmount;
        tank.FuelType = request.Data.FuelType;

        await _context.SaveChangesAsync(cancellationToken);
        return request.Id;
      }
    }
  }
}
