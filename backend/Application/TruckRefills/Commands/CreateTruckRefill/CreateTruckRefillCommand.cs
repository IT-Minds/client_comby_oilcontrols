using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Entities;
using Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.TruckRefills.Commands.CreateTruckRefill
{
  public class CreateTruckRefillCommand : IRequest<int>
  {
    public int TruckId { get; set; }
    public DateTime TimeStamp { get; set; }
    public int FuelCardNumber { get; set; }
    public double Amount { get; set; }
    public FuelType FuelType { get; set; }

    public class CreateTruckRefillCommandHandler : IRequestHandler<CreateTruckRefillCommand, int>
    {
      private readonly IApplicationDbContext _context;

      public CreateTruckRefillCommandHandler(IApplicationDbContext context)
      {
        _context = context;
      }
      public async Task<int> Handle(CreateTruckRefillCommand request, CancellationToken cancellationToken)
      {
        var truck = await _context.Trucks
        .Include(x => x.DailyStates)
        .FirstOrDefaultAsync(x => x.Id == request.TruckId);
        if (truck == null)
        {
          throw new NotFoundException(nameof(truck), request.TruckId);
        }

        var dailyState = truck.DailyStates.FirstOrDefault(x => x.Date.DayOfYear == request.TimeStamp.DayOfYear && x.Date.Year == request.TimeStamp.Year);
        if (dailyState == null)
        {
          throw new NotFoundException(nameof(dailyState), "For truck with id: " + request.TruckId + " on date: " + request.TimeStamp);
        }
        var truckRefill = new TruckRefill
        {
          TimeStamp = request.TimeStamp,
          FuelCardNumber = request.FuelCardNumber,
          Amount = request.Amount,
          FuelType = request.FuelType,
          TruckDailyStateId = dailyState.Id
        };
        _context.TruckRefills.Add(truckRefill);
        await _context.SaveChangesAsync(cancellationToken);
        return truckRefill.Id;
      }
    }
  }
}