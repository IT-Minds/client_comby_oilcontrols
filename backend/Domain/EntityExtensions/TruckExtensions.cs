using System;
using System.Linq;
using Domain.Entities;

namespace Domain.EntityExtensions
{
  public static class TruckExtensions
  {
    public static double EveningQuantity(this Truck truck, DateTime date)
    {
      var dailyState = truck.DailyStates
        .FirstOrDefault(x => x.Date.DayOfYear == date.DayOfYear && x.Date.Year == date.Year);
      double positives = 0.0;
      if (dailyState != null)
      {
        var truckFills = dailyState.TruckRefills
          .Where(x => x.TimeStamp.DayOfYear == date.DayOfYear && x.TimeStamp.Year == date.Year)
          .Sum(x => x.Amount);

        positives += dailyState.MorningQuantity + truckFills;
      }

      var locationFills = truck.CompletedRefills
        .Where(x => x.ActualDeliveryDate.DayOfYear == date.DayOfYear && x.ActualDeliveryDate.Year == date.Year)
        .Sum(x => x.AmountDelivered());

      return positives - locationFills;
    }
  }
}
