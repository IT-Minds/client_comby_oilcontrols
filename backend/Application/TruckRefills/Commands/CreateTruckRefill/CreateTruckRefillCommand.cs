using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Common.Security;
using Domain.Entities;
using Domain.EntityExtensions;
using Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.TruckRefills.Commands.CreateTruckRefill
{
  [AuthorizeAttribute(Domain.Enums.Action.CREATE_TRUCK_REFILL)]
  public class CreateTruckRefillCommand : IRequest<int>
  {
    [JsonIgnore]
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
        .Include(x => x.DailyStates.Where(x => x.Date.DayOfYear == request.TimeStamp.DayOfYear && x.Date.Year == request.TimeStamp.Year))
        .FirstOrDefaultAsync(x => x.Id == request.TruckId);

        if (truck == null)
        {
          throw new NotFoundException(nameof(truck), request.TruckId);
        }

        var dailyState = truck.DailyStates.FirstOrDefault();

        if (dailyState == null)
        {
          double morningQuantity = 0;
          try
          {
            truck = await _context.Trucks
              .Include(x => x.DailyStates)
                .ThenInclude(x => x.TruckRefills)
              .Include(r => r.Refills)
              .FirstAsync(x => x.Id == request.TruckId);

            DateTime dayBefore = request.TimeStamp;
            dayBefore.AddDays(-1);
            morningQuantity = truck.EveningQuantity(dayBefore);
          }
          catch
          {
            System.Console.WriteLine("Exception finding daily state morning quantity in CreateTruckRefillCommand");
          }

          dailyState = new TruckDailyState
          {
            Truck = truck,
            Date = request.TimeStamp.Date,
            MorningQuantity = morningQuantity,
            EveningQuantity = morningQuantity
          };
        }

        dailyState.EveningQuantity += request.Amount;

        var truckRefill = new TruckRefill
        {
          TimeStamp = request.TimeStamp,
          FuelCardNumber = request.FuelCardNumber,
          Amount = request.Amount,
          FuelType = request.FuelType,
          TruckDailyState = dailyState
        };

        _context.TruckRefills.Add(truckRefill);

        await _context.SaveChangesAsync(cancellationToken);

        return truckRefill.Id;
      }
    }
  }
}
