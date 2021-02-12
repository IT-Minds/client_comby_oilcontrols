using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;

namespace Application.Locations.Queries.GetHistoricConsumption
{
  public class GetHistoricConsumptionQuery : IRequest<List<LocationConsumptionDto>>
  {
    public HistoricConsumptionDto Dto { get; set; }

    public class GetHistoricConsumptionQueryHandler : IRequestHandler<GetHistoricConsumptionQuery, List<LocationConsumptionDto>>
    {
      private readonly IApplicationDbContext _context;

      public GetHistoricConsumptionQueryHandler(IApplicationDbContext context)
      {
        _context = context;
      }

      public async Task<List<LocationConsumptionDto>> Handle(GetHistoricConsumptionQuery request, CancellationToken cancellationToken)
      {
        var location = await _context.Locations
            .Include(x => x.Refills)
            .Where(x => x.Id == request.Dto.LocationId)
            .FirstOrDefaultAsync();

        var refills = location.Refills
          .Where(x => x.ActualDeliveryDate >= request.Dto.StartDate && x.ActualDeliveryDate < request.Dto.EndDate)
          .OrderBy(x => x.ActualDeliveryDate)
          .ToList();

        var prevRefill = location.Refills
          .Where(x => x.ActualDeliveryDate < (refills == null || refills.Count() == 0 ? request.Dto.StartDate : refills.First().ActualDeliveryDate))
          .OrderByDescending(x => x.ActualDeliveryDate)
          .FirstOrDefault();



        var lastRefill = location.Refills
          .Where(x => x.ActualDeliveryDate > (refills == null || refills.Count() == 0 ? request.Dto.EndDate : refills.First().ActualDeliveryDate))
          .OrderByDescending(x => x.ActualDeliveryDate)
          .FirstOrDefault();

        if (prevRefill != null && !refills.Contains(prevRefill))
        {
          refills.Add(prevRefill);
        }
        if (lastRefill != null && !refills.Contains(lastRefill))
        {
          refills.Add(lastRefill);
        }

        if (refills.Count() < 2)
        {
          throw new ArgumentException("There's only one refill registered in the period " + request.Dto.StartDate + " - " + request.Dto.EndDate + " and it's therefor not possible to determine how much fuel has been consumed in this period.");
        }

        List<(DateTime StartDate, DateTime EndDate, double consumed)> consumptions = new List<(DateTime StartDate, DateTime EndDate, double consumed)>();
        DateTime prevRefillDate;
        double daysInPeriod;
        double consumedPrDay;

        foreach (var refill in refills)
        {
          if (prevRefill != null)
          {
            prevRefillDate = (prevRefill.ActualDeliveryDate.Value < request.Dto.StartDate ? request.Dto.StartDate : prevRefill.ActualDeliveryDate.Value);
            var daysBetweenRefills = (refill.ActualDeliveryDate.Value - prevRefill.ActualDeliveryDate.Value).TotalDays;
            var consumedBetweenRefills = (prevRefill.EndAmount.Value - refill.StartAmount.Value);
            consumedPrDay = consumedBetweenRefills / daysBetweenRefills;
            consumptions.Add((prevRefillDate, refill.ActualDeliveryDate.Value, consumedPrDay));
          }

          prevRefill = refill;

          // if (refills.IndexOf(refill) == refills.Count() - 1 && lastRefill != null && refill != lastRefill)
          // {
          //   var lastRefillDate = request.Dto.EndDate;

          //   consumedPrDay = (refill.EndAmount.Value - lastRefill.StartAmount.Value) / (lastRefill.ActualDeliveryDate.Value - refill.ActualDeliveryDate.Value).TotalDays;
          //   consumptions.Add((refill.ActualDeliveryDate.Value, lastRefillDate, consumedPrDay));
          // }
        }

        var intervalStart = request.Dto.StartDate;
        var intervalEnd = intervalStart;
        switch (request.Dto.Interval)
        {
          case Domain.Enums.Interval.WEEK:
            intervalEnd = intervalStart.AddDays(7);
            break;
          case Domain.Enums.Interval.MONTH:
            intervalEnd = intervalStart.AddMonths(1);
            break;
          case Domain.Enums.Interval.YEAR:
            intervalEnd = intervalStart.AddYears(1);
            break;
        }

        List<LocationConsumptionDto> result = new List<LocationConsumptionDto>();
        while (intervalStart < request.Dto.EndDate)
        {

          var consumps = consumptions
            .Where(x => x.EndDate >= intervalStart && x.StartDate <= intervalEnd)
            .ToList();


          result.Add(
            new LocationConsumptionDto
            {
              LocationId = location.Id,
              Address = location.Address,
              StartDate = intervalStart,
              EndDate = intervalEnd,
              FuelConsumed = consumps.Aggregate(
                0.0,
                (sum, curr) =>
                {
                  var calcStart = (curr.StartDate < intervalStart ? intervalStart : curr.StartDate);
                  var calcEnd = (curr.EndDate > intervalEnd ? intervalEnd : curr.EndDate);
                  //Ensure that the last day of the reqeust period is included.
                  if (calcEnd.Equals(request.Dto.EndDate))
                    calcEnd = calcEnd.AddDays(1);
                  var dateDiff = (calcEnd - calcStart).TotalDays;
                  return (curr.consumed * dateDiff) + sum;
                }
              )
            }
          );

          intervalStart = intervalEnd;
          switch (request.Dto.Interval)
          {
            case Domain.Enums.Interval.WEEK:
              intervalEnd = intervalStart.AddDays(7);
              break;
            case Domain.Enums.Interval.MONTH:
              intervalEnd = intervalStart.AddMonths(1);
              break;
            case Domain.Enums.Interval.YEAR:
              intervalEnd = intervalStart.AddYears(1);
              break;
          }
          if (intervalEnd > request.Dto.EndDate)
          {
            intervalEnd = request.Dto.EndDate;
          }
        }
        return result;
      }
    }
  }
}