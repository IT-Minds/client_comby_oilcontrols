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
    public LocationDetailsDto Data { get; set; }

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

          TankCapacity = request.Data.TankCapacity,

          MinimumFuelAmount = request.Data.MinimumFuelAmount,
          FuelType = request.Data.FuelType
        };
        _context.FuelTanks.Add(tank);

        var location = new Location
        {
          Address = request.Data.Address,
          AddressExtra = request.Data.AddressExtra,
          Comments = request.Data.Comments,
          Schedule = request.Data.Schedule,
          RegionId = request.Data.RegionId,
          FuelTank = tank,
          EstimateFuelConsumption = request.Data.EstimateFuelConsumption,
          DaysBetweenRefills = request.Data.DaysBetweenRefills,
          TankType = request.Data.TankType,
          TankNumber = request.Data.BSTNumber,
        };
        _context.Locations.Add(location);

        await _context.SaveChangesAsync(cancellationToken);
        return location.Id;
      }
    }
  }
}
