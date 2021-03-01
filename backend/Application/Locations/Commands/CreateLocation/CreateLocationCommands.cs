using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Domain.Enums;
using global::Application.Common.Interfaces;
using Domain.Entities;
using Application.Common.Security;
using System.Linq;
using System;
using System.Collections.Generic;

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
          InactiveSince = null
        };

        var locationDebtors = new List<LocationDebtor>();
        if (request.Data.BaseDebtorId != null)
        {
          var baseDebtor = _context.Debtors.Where(x => x.Id == request.Data.BaseDebtorId).FirstOrDefault();
          if (baseDebtor == null)
          {
            throw new ArgumentException("No debtor with id: " + request.Data.BaseDebtorId);
          }
          locationDebtors.Add(new LocationDebtor { Type = LocationDebtorType.BASE, Location = location, Debtor = baseDebtor });

        }
        if (request.Data.MainDebtorId != null)
        {
          var mainDebtor = _context.Debtors.Where(x => x.Id == request.Data.MainDebtorId).FirstOrDefault();
          if (mainDebtor == null)
          {
            throw new ArgumentException("No debtor with id: " + request.Data.MainDebtorId);
          }
          locationDebtors.Add(new LocationDebtor { Type = LocationDebtorType.MAIN, Location = location, Debtor = mainDebtor });
        }

        if (request.Data.UpcomingDebtorId != null)
        {
          var upcomingDebtor = _context.Debtors.Where(x => x.Id == request.Data.UpcomingDebtorId).FirstOrDefault();
          if (upcomingDebtor == null)
          {
            throw new ArgumentException("No debtor with id: " + request.Data.UpcomingDebtorId);
          }
          locationDebtors.Add(new LocationDebtor { Type = LocationDebtorType.UPCOMING, Location = location, Debtor = upcomingDebtor, DebtorChangeDate = request.Data.DebtorChangeDate });
        }

        _context.Locations.Add(location);
        await _context.SaveChangesAsync(cancellationToken);

        _context.LocationDebtors.AddRange(locationDebtors);

        await _context.SaveChangesAsync(cancellationToken);
        return location.Id;
      }
    }
  }
}
