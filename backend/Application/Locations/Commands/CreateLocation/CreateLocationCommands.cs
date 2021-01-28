using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
using global::Application.Common.Interfaces;
using Application.Common.Exceptions;
using Domain.Entities;
using System;

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
    public double EstimateConsumption { get; set; }
    public int DaysBetweenRefills { get; set; }
    public FuelType FuelType { get; set; }
    public LocationDebtorType DebtorType { get; set; }
    public int DebtorId { get; set; }
    public DateTime? DebtorChangeDate { get; set; }

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

        if (request.DebtorType == LocationDebtorType.UPCOMING
          && request.DebtorChangeDate == null || DateTime.UtcNow.CompareTo(request.DebtorChangeDate) <= 0)
        {
          throw new ArgumentException("Debtor Change date not specified or earlier than: " + DateTime.UtcNow.Date);
        }

        var debtor = await _context.Debtors.FirstOrDefaultAsync(x => x.Id == request.DebtorId);
        if (debtor == null)
        {
          throw new ArgumentException("No debtor with Id: " + request.DebtorId);
        }
        var location = new Location
        {
          Address = request.Address,
          Comments = request.Comment,
          Schedule = request.Refillschedule,
          RegionId = request.RegionId,
          FuelTank = tank,
          EstimateFuelConsumption = request.EstimateConsumption,
          DaysBetweenRefills = request.DaysBetweenRefills,

        };
        _context.Locations.Add(location);

        var LocationDebtor = new LocationDebtor
        {
          Type = request.DebtorType,
          Location = location,
          Debtor = debtor,
          DebtorChangeDate = request.DebtorChangeDate
        };
        _context.LocationDebtors.Add(LocationDebtor);

        await _context.SaveChangesAsync(cancellationToken);
        return location.Id;
      }
    }
  }
}
