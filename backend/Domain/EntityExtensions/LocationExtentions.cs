using System;
using System.Linq;
using Domain.Entities;

namespace Domain.EntityExtensions
{
  public static class LocationExtensions
  {
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