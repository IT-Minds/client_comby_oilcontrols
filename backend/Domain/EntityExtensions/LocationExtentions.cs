using System;
using System.Linq;
using Domain.Entities;
namespace Domain.EntityExtensions
{
  public static class LocationExtensions
  {
    const int HEAT_BASE = 21;

    public static double FuelConsumptionPerDegreeOfHeating(this Location location)
    {
      if (location.Refills == null)
      {
        throw new ArgumentException("No past refills for location: " + location.Id);
      }

      var pastRefills = location.Refills.Where(x => x.ActualDeliveryDate != null).OrderByDescending(x => x.ActualDeliveryDate);
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
      var fuelConsumed = pastRefills.Where(x => x.ActualDeliveryDate > startDate).Sum(x => x.AmountDelivered());

      return (fuelConsumed ??  0) / heatingDegree;
    }


    /// <summary>
    ///
    /// Required domain structure
    ///
    /// * Location
    ///   * Refills
    ///   * FuelTank
    ///   * Region
    ///     * DailyTemperatures
    ///
    /// </summary>
    /// <param name="location"></param>
    /// <returns>DateTime </returns>
    public static DateTime PredictDayReachingMinimumFuelLevel(this Location location, int maxDays = 7)
    {
      double limit = location.FuelTank.MinimumFuelAmount;
      var sortedRefills = location.Refills.Where(x => x.ActualDeliveryDate.HasValue).OrderBy(x => x.ActualDeliveryDate);
      var newestRefill = sortedRefills.Last();
      var refillDate = (DateTime)newestRefill.ActualDeliveryDate;
      var fuelAmount = newestRefill.EndAmount;
      var fuelConsumption = location.FuelConsumptionPerDegreeOfHeating();

      var currentDate = refillDate;
      var count = 0;
      do
      {
        currentDate = currentDate.AddDays(1);
        var heatdegree = location.Region.DailyTemperatureEstimate(currentDate);
        var fuelConsumed = heatdegree * fuelConsumption;
        fuelAmount = fuelAmount - fuelConsumed;
        count++;
      }
      while (fuelAmount > location.FuelTank.MinimumFuelAmount && count < maxDays);

      return currentDate.AddDays(-1);
    }
  }
}
