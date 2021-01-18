using System;
using System.Linq;
using Domain.Entities;
namespace Domain.EntityExtensions
{
  public static class LocationExtensions
  {
    public static double FuelConsumptionPerDegreeOfHeating(this Location location)
    {
      const int HEAT_BASE = 21;

      var pastRefills = location.Refills.Where(x => x.ActualDeliveryDate != null).OrderByDescending(x => x.ActualDeliveryDate);
      if (pastRefills == null)
      {
        throw new ArgumentException("No past refills for location: " + location.Id);
      }
      var endDate = pastRefills.First().ActualDeliveryDate;
      var startDate = pastRefills.Last().ActualDeliveryDate;

      var dailyTemps = location.Region.DailyTemperatures.Where(x => x.Date >= startDate && x.Date <= endDate);
      if (pastRefills == null)
      {
        throw new ArgumentException("No temperatures found for location " + location.Id + " in the period " + startDate + " " + endDate);
      }

      var heatingDegree = dailyTemps.Sum(x => HEAT_BASE - x.Temperature);
      var fuelConsumed = pastRefills.Where(x => x.ActualDeliveryDate > startDate).Sum(x => x.AmountDelivered);

      return fuelConsumed / heatingDegree;
    }
  }
}