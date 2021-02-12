using System;
using System.Collections.Generic;
using System.Linq;
using Domain.Entities;
using Domain.Entities.Refills;

namespace Domain.EntityExtensions
{
  public static class LocationExtensions
  {
    const double HEAT_BASE = 21;

    public static double HeatingIndex(this Location location, DateTime startDate, DateTime endDate)
    {
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
        return location.EstimateFuelConsumption;
      }

       var pastRefills = location.CompletedRefills.OrderByDescending(x => x.ActualDeliveryDate);

      if (pastRefills == null || pastRefills.Count() < 3)
      {
        return location.EstimateFuelConsumption;
      }

      var endDate = (DateTime)pastRefills.First().ActualDeliveryDate;
      var startDate = (DateTime)pastRefills.Last().ActualDeliveryDate;

      var dailyTemps = location.Region.DailyTemperatures.Where(x => x.Date >= startDate && x.Date <= endDate);
      if (dailyTemps == null || dailyTemps.Count() == 0)
      {
        return location.EstimateFuelConsumption;
      }

      var heatIndex = location.HeatingIndex(startDate, endDate);
      var fuelConsumed = pastRefills.Where(x => x.ActualDeliveryDate > startDate).Sum(x => x.AmountDelivered());

      return fuelConsumed == 0 ? location.EstimateFuelConsumption : fuelConsumed / heatIndex;
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
      var newestRefill = location.CompletedRefills.OrderBy(x => x.ActualDeliveryDate).LastOrDefault();

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
          //Calculate the "heat index/opvarmingsgrad" for this particular date based on the temperature estimate.
          heatdegree = HEAT_BASE - location.Region.DailyTemperatureEstimate(currentDate);
        }
        catch
        {
          heatdegree = HEAT_BASE; // TODO default / fallback temperature
        }
        var fuelConsumed = heatdegree * fuelConsumption;
        fuelAmount = fuelAmount - fuelConsumed;
        count++;
      }
      while (fuelAmount > location.FuelTank.MinimumFuelAmount && count < maxDays);

      return currentDate.AddDays(-1);
    }

    public static double EstimatedYearlyFuelConsumption(this Location location, int year)
    {
      DateTime period = new DateTime(year, 1, 1);
      double heatDegreeSum = 0;
      while (period.Year == year)
      {
        heatDegreeSum += (double)HEAT_BASE - location.Region.DailyTemperatureEstimate(period);
        period = period.AddDays(1);
      }

      return location.FuelConsumptionPerDegreeOfHeating() * heatDegreeSum;
    }

    public static double EstimateMonthlyCost(this Location location, double oilPrice = 10.5)
    {
      var totalConsumption = location.EstimatedYearlyFuelConsumption(DateTime.UtcNow.Year);
      return (totalConsumption * oilPrice) / 12;
    }
    public static Debtor MainDebtor(this Location location)
    {
      return location.Debtors.FirstOrDefault(x => x.Type == Enums.LocationDebtorType.MAIN)?.Debtor;
    }

    public static Debtor BaseDebtor(this Location location)
    {
      return location.Debtors.FirstOrDefault(x => x.Type == Enums.LocationDebtorType.BASE)?.Debtor;
    }

    public static Debtor UpcomingDebtor(this Location location)
    {
      return location.Debtors.FirstOrDefault(x => x.Type == Enums.LocationDebtorType.UPCOMING)?.Debtor;
    }

    public static Debtor ActiveDebtor(this Location location)
    {
      var baseDebtor = location.BaseDebtor();
      if (baseDebtor != null) return baseDebtor;

      var mainDebtor = location.MainDebtor();
      if (mainDebtor != null) return mainDebtor;

      return null;
    }
  }
}
