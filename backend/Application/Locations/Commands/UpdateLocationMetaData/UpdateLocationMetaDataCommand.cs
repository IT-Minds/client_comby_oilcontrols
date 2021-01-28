using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using MediatR;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Application.Common.Exceptions;
using Domain.Entities;
using Newtonsoft.Json;
using System;

namespace Application.Locations.Commands.UpdateLocationMetaData
{
  public class UpdateLocationMetaDataCommand : IRequest<int>
  {
    [JsonIgnore]
    public int Id { get; set; }
    public string Address { get; set; }
    public string Comment { get; set; }
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

        var locationDebtor = await _context.LocationDebtors.FirstOrDefaultAsync(x => x.DebtorId == request.DebtorId && x.LocationId == request.Id);
        if (locationDebtor == null)
        {
          locationDebtor = new LocationDebtor
          {
            Type = request.DebtorType,
            Location = location,
            Debtor = debtor,
            DebtorChangeDate = request.DebtorChangeDate
          };
          _context.LocationDebtors.Add(locationDebtor);
        }
        else
        {
          locationDebtor.Type = request.DebtorType;
          locationDebtor.DebtorChangeDate = request.DebtorChangeDate;
        }

        location.Address = request.Address;
        location.Comments = request.Comment;
        location.Schedule = request.Refillschedule;
        location.EstimateFuelConsumption = request.EstimateConsumption;
        location.DaysBetweenRefills = request.DaysBetweenRefills;

        var tank = location.FuelTank;
        tank.TankType = request.TankType;
        tank.TankNumber = request.TankNumber;
        tank.TankCapacity = request.TankCapacity;
        tank.MinimumFuelAmount = request.MinimumFuelAmount;
        tank.FuelType = request.FuelType;

        await _context.SaveChangesAsync(cancellationToken);
        return request.Id;
      }
    }
  }
}
