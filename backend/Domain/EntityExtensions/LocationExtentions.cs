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
      if (location.Refills == null)
      {
        throw new ArgumentException("No past refills for location: " + location.Id);
      }

      var pastRefills = location.Refills
        .OrderByDescending(x => x.ActualDeliveryDate);

      if (pastRefills == null || pastRefills.Count() == 0)
      {
        throw new ArgumentException("No past refills for location: " + location.Id);
      }

      var endDate = pastRefills.First().ActualDeliveryDate;
      var startDate = pastRefills.Last().ActualDeliveryDate;

      var dailyTemps = location.Region.DailyTemperatures.Where(x => x.Date >= startDate && x.Date <= endDate);
      if (dailyTemps == null || dailyTemps.Count() == 0)
      {
        throw new ArgumentException("No temperatures found for location " + location.Id + " in the period " + startDate + " " + endDate);
      }

      var heatingDegree = dailyTemps.Sum(x => HEAT_BASE - x.Temperature);
      var fuelConsumed = pastRefills.Where(x => x.ActualDeliveryDate > startDate).Sum(x => x.AmountDelivered);

      return fuelConsumed / heatingDegree;
    }

    public static DateTime PredictDayReachingMinimumFuelLevel(this Location location)
    {
      double limit = location.FuelTank.MinimumFuelAmount;
      var sortedRefills = location.Refills.OrderBy(x => x.ActualDeliveryDate);
      var newestRefill = sortedRefills.Last();
      var refillDate = newestRefill.ActualDeliveryDate;
      var fuelAmount = newestRefill.EndAmount;
      var fuelConsumption = location.FuelConsumptionPerDegreeOfHeating();

      var currentDate = refillDate;
      do
      {
        currentDate = currentDate.AddDays(1);
        var heatdegree = location.Region.DailyTemperatureEstimate(currentDate);
        var fuelConsumed = heatdegree * fuelConsumption;
        fuelAmount = fuelAmount - fuelConsumed;
      }
      while (fuelAmount > location.FuelTank.MinimumFuelAmount);

      return currentDate.AddDays(-1);
    }
  }
}
