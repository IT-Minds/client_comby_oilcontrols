using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Domain.Entities.Refills;
using Domain.EntityExtensions;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Application.Common.Services
{
  public class StatsService
  {

    private readonly IApplicationDbContext _context;

    public StatsService(IApplicationDbContext context)
    {
      _context = context;
    }

    public async Task<IEnumerable<CsvDto>> ReportRefillsOfYear(int year)
    {
      var refills = await _context.CompletedRefills
        .Include(x => x.Location)
          .ThenInclude(x => x.FuelTank)
        .Include(x => x.Location)
          .ThenInclude(x => x.Debtors)
            .ThenInclude(x => x.Debtor)
        .Where(x => x.ActualDeliveryDate.Year == year && x.RefillState == RefillState.COMPLETED)
        .OrderBy(x => x.Location.Address)
          .ThenBy(x => x.ActualDeliveryDate)
        .ToListAsync();

      var result = refills.Select(x => new CsvDto
      {
        Date = x.ActualDeliveryDate,
        TankNumber = x.Location.TankNumber,
        Address = x.Location.Address,
        Name = x.Location.ActiveDebtor()?.UnicontaId.ToString() ?? "",
        Amount = x.AmountDelivered()
      });

      return result;
    }

    public async Task<IEnumerable<FuelConsumptionDto>> ReportFuelConsumption(int LocationId, Interval interval, DateTime startDate, DateTime endDate)
    {
      var location = await _context.Locations
          .Include(x => x.Refills)
          .Where(x => x.Id == LocationId)
          .FirstOrDefaultAsync();

      var refills = location.CompletedRefills
        .Where(x => x.ActualDeliveryDate >= startDate && x.ActualDeliveryDate < endDate)
        .OrderBy(x => x.ActualDeliveryDate)
        .ToList();

      var prevRefill = location.CompletedRefills
        .Where(x => x.ActualDeliveryDate < (refills == null || refills.Count() == 0 ? startDate : refills.First().ActualDeliveryDate))
        .OrderByDescending(x => x.ActualDeliveryDate)
        .FirstOrDefault();

      var lastRefill = location.CompletedRefills
        .Where(x => x.ActualDeliveryDate > (refills == null || refills.Count() == 0 ? endDate : refills.First().ActualDeliveryDate))
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
        throw new ArgumentException("There's only one refill registered in the period " + startDate + " - " + endDate + " and it's therefor not possible to determine how much fuel has been consumed in this period.");
      }

      List<(DateTime StartDate, DateTime EndDate, double consumed)> consumptions = new List<(DateTime StartDate, DateTime EndDate, double consumed)>();
      DateTime prevRefillDate;
      double consumedPrDay;

      foreach (var refill in refills)
      {
        if (prevRefill != null)
        {
          prevRefillDate = (prevRefill.ActualDeliveryDate < startDate ? startDate : prevRefill.ActualDeliveryDate);
          var daysBetweenRefills = (refill.ActualDeliveryDate - prevRefill.ActualDeliveryDate).TotalDays;
          var consumedBetweenRefills = (prevRefill.EndAmount - refill.StartAmount);
          consumedPrDay = consumedBetweenRefills / daysBetweenRefills;
          consumptions.Add((prevRefillDate, refill.ActualDeliveryDate, consumedPrDay));
        }

        prevRefill = refill;
      }

      var intervalStart = startDate;
      var intervalEnd = intervalStart;
      switch (interval)
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

      List<FuelConsumptionDto> result = new List<FuelConsumptionDto>();
      while (intervalStart < endDate)
      {

        var consumps = consumptions
          .Where(x => x.EndDate >= intervalStart && x.StartDate <= intervalEnd)
          .ToList();


        result.Add(
          new FuelConsumptionDto
          {
            LocationId = location.Id,
            Address = location.Address,
            StartDate = intervalStart,
            EndDate = intervalEnd,
            FuelConsumed = Math.Abs(consumps.Aggregate(
              0.0,
              (sum, curr) =>
              {
                var calcStart = (curr.StartDate < intervalStart ? intervalStart : curr.StartDate);
                var calcEnd = (curr.EndDate > intervalEnd ? intervalEnd : curr.EndDate);
                //Ensure that the last day of the request period is included.
                if (calcEnd.Equals(endDate))
                  calcEnd = calcEnd.AddDays(1);
                var dateDiff = (calcEnd - calcStart).TotalDays;
                return (curr.consumed * dateDiff) + sum;
              }
            ))
          }
        );

        intervalStart = intervalEnd;
        switch (interval)
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
        if (intervalEnd > endDate)
        {
          intervalEnd = endDate;
        }
      }

      return result;
    }
  }

  public class CsvDto
  {
    public DateTime Date { get; set; }
    public string TankNumber { get; set; }
    public string Address { get; set; }
    public string Name { get; set; }
    public double Amount { get; set; }
  }

  public class FuelConsumptionDto
  {
    public string Address { get; set; }
    public int LocationId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public double FuelConsumed { get; set; }
  }
}
