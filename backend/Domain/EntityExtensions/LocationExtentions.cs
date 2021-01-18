using System;
using System.Linq;
using Domain.Entities;
namespace Domain.EntityExtensions
{
  public static class LocationExtensions
  {
    const int HEAT_BASE = 21;

    public static double HeatingIndex(this Location location, DateTime startDate, DateTime endDate)
    {
      const int HEAT_BASE = 21;

      var dailyTemps = location.Region.DailyTemperatures.Where(x => x.Date >= startDate && x.Date <= endDate);
      if (dailyTemps == null || dailyTemps.Count() == 0)
      {
        throw new ArgumentException("No temperatures found for location " + location.Id + " in the period " + startDate + " " + endDate);
      }

      var heatIndex = dailyTemps.Sum(x => HEAT_BASE - x.Temperature);
      return heatIndex;
    }

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

      var endDate = (DateTime)pastRefills.First().ActualDeliveryDate;
      var startDate = (DateTime)pastRefills.Last().ActualDeliveryDate;

      var dailyTemps = location.Region.DailyTemperatures.Where(x => x.Date >= startDate && x.Date <= endDate);
      if (dailyTemps == null || dailyTemps.Count() == 0)
      {
        throw new ArgumentException("No temperatures found for location " + location.Id + " in the period " + startDate + " " + endDate);
      }

      var heatIndex = location.HeatingIndex(startDate, endDate);
      var fuelConsumed = pastRefills.Where(x => x.ActualDeliveryDate > startDate).Sum(x => x.AmountDelivered() ?? 0);

      return fuelConsumed / heatIndex;
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
      var newestRefill = location.Refills
        .Where(x => x.ActualDeliveryDate.HasValue)
        .OrderBy(x => x.ActualDeliveryDate).LastOrDefault();

      if (newestRefill == null)
      {
        return DateTime.UtcNow;
      }


      var fuelAmount = newestRefill.EndAmount;
      double fuelConsumption;
      try
      {
        fuelConsumption = location.FuelConsumptionPerDegreeOfHeating();
      }
      catch
      {
        return DateTime.UtcNow;
      }

      var currentDate = (DateTime)newestRefill.ActualDeliveryDate;
      var count = 0;
      do
      {
        currentDate = currentDate.AddDays(1);
        double heatdegree;
        try
        {
          heatdegree = location.Region.DailyTemperatureEstimate(currentDate);
        }
        catch
        {
          heatdegree = 20; // TODO default / fallback temperature
        }
        var fuelConsumed = heatdegree * fuelConsumption;
        fuelAmount = fuelAmount - fuelConsumed;
        count++;
      }
      while (fuelAmount > location.FuelTank.MinimumFuelAmount && count < maxDays);

      return currentDate.AddDays(-1);
    }
  }
}
