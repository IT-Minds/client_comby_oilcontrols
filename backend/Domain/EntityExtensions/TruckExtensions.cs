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
      var dailyState = truck.DailyStates.FirstOrDefault(x => x.Date.DayOfYear == date.DayOfYear && x.Date.Year == date.Year);
      if (dailyState == null)
      {
        throw new ArgumentException("No dailystate registered for truck: " + truck.Id + " on date: " + date.ToLongDateString());
      }

      var truckFills = dailyState.TruckRefills
        .Where(x => x.TimeStamp.DayOfYear == date.DayOfYear && x.TimeStamp.Year == date.Year)
        .Sum(x => x.Amount);
      var locaitonFills = truck.Route.Refills
        .Where(x => x.ActualDeliveryDate.HasValue && x.ActualDeliveryDate?.DayOfYear == date.DayOfYear && x.ActualDeliveryDate?.Year == date.Year)
        .Sum(x => x.AmountDelivered() ?? 0);



      return dailyState.MorningQuantity + truckFills - locaitonFills ;
    }

    public static TruckDailyState GetCurrentDailyState(this Truck truck)
    {
      var date = DateTime.Now;
      var dailyState = truck.DailyStates.FirstOrDefault(x => x.Date.DayOfYear == date.DayOfYear && x.Date.Year == date.Year);

      return dailyState;
    }

    public static double GetCurrentTankLevel(this Truck truck)
    {
      var dailyState = truck.GetCurrentDailyState();

      if (dailyState == null) return 0;

      return dailyState.EveningQuantity;
    }


    // //Returns -1 if there is no "Refill Number" to be found at all.
    // public static int CurrentRefillNumber(this Truck truck)
    // {
    //   var newestRefill = truck.Route?.Refills?.Where(x => x.ActualDeliveryDate != null)?.OrderByDescending(x => x.ActualDeliveryDate).FirstOrDefault();
    //   if (newestRefill != null && newestRefill.RefillNumber != null)
    //   {
    //     return (int)newestRefill.RefillNumber;
    //   }
    //   var dailyState = truck.DailyStates?.OrderByDescending(x => x.Date).FirstOrDefault();
    //   if (dailyState != null)
    //   {
    //     return dailyState.StartRefillNumber;
    //   }
    //   return -1;
    // }
  }
}
