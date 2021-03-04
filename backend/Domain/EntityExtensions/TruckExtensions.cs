using System;
using System.Collections.Generic;
using System.Linq;
using Domain.Entities;
using Domain.Entities.Refills;
using Domain.Enums;

namespace Domain.EntityExtensions
{
  public static class TruckExtensions
  {
    public static double EveningQuantity(this Truck truck, DateTime date)
    {
      var dailyState = truck.DailyStates.FirstOrDefault(x => x.Date.DayOfYear == date.DayOfYear && x.Date.Year == date.Year);
      if (dailyState == null)
      {
        throw new ArgumentException("No dailystate registered for truck: " + truck.Id + " on date: " + date.ToLongDateString());
      }

      var truckFills = dailyState.TruckRefills
        .Where(x => x.TimeStamp.DayOfYear == date.DayOfYear && x.TimeStamp.Year == date.Year)
        .Sum(x => x.Amount);

      var locationFills = truck.CompletedRefills
        .Where(x => x.RefillState == RefillState.COMPLETED)
        .Where(x => x.ActualDeliveryDate.DayOfYear == date.DayOfYear && x.ActualDeliveryDate.Year == date.Year)
        .Sum(x => x.AmountDelivered());

      return dailyState.MorningQuantity + truckFills - locationFills ;
    }
  }
}
