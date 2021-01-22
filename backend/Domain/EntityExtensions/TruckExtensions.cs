using System;
using System.Collections.Generic;
using System.Linq;
using Domain.Entities;
using Domain.Enums;

namespace Domain.EntityExtensions
{
  public static class TruckExtensions
  {
    public static double EveningQuantity(this Truck truck, DateTime date)
    {
      var dailyState = truck.DailyStates.FirstOrDefault(x => x.Date == date);
      if (dailyState == null)
      {
        throw new ArgumentException("No dailystate registered for truck: " + truck.Id + " on date: " + date);
      }
      double refillDelta = 0.0;
      TruckRefill latestDifferentRefill = null;
      FuelType latestFuelType = FuelType.OTHER;
      var truckRefills = dailyState.TruckRefills.OrderByDescending(x => x.TimeStamp);
      if (truckRefills != null && truckRefills.Count() != 0)
      {
        latestFuelType = truckRefills.ToList()[0].FuelType;
        latestDifferentRefill = truckRefills
          .Where(x => x.FuelType != latestFuelType)
          .ToList().FirstOrDefault();

        var latestRefills = latestDifferentRefill == null ? truckRefills : truckRefills.Where(x => x.TimeStamp > latestDifferentRefill.TimeStamp && x.FuelType == latestFuelType);
        refillDelta = latestRefills.Sum(x => x.Amount);
      }

      List<Refill> deliveries = new List<Refill>();
      if (latestDifferentRefill == null)
      {
        deliveries = truck.Route.Refills.Where(x => x.ActualDeliveryDate.DayOfYear == date.DayOfYear).ToList();
      }
      else
      {
        deliveries = truck.Route.Refills.Where(x => x.ActualDeliveryDate > latestDifferentRefill.TimeStamp && x.Type == latestFuelType).ToList();
      }

      double deliveryDelta = 0.0;
      if (deliveries != null && deliveries.Count() != 0)
      {
        deliveryDelta = deliveries.Sum(x => x.AmountDelivered());
      }
      return (latestDifferentRefill == null ? dailyState.MorningQuantity : 0) + refillDelta - deliveryDelta;
    }
  }
}