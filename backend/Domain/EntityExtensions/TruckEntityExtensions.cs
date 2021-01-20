using System;
using System.Linq;
using Domain.Entities;

namespace Domain.EntityExtensions
{
  public static class TruckExtensions
  {
    //TODO: FIGURE OUT HOW WE WANT TO HANDLE THE FACT THAT A TRUCK MIGHT BE DRIVING WITH DIFFERENT TYPES OF FUEL DURING THE DAY.
    public static double EveningQuantity(this Truck truck, DateTime? date)
    {
      if (date == null)
      {
        date = DateTime.Today;
      }
      var dailyState = truck.DailyStates.FirstOrDefault(x => x.Date == date);
      if (dailyState == null)
      {
        throw new ArgumentException("No information registered for truck: " + truck.Id + " on date: " + date);
      }
      var truckRefills = dailyState.TruckRefills;
      var refillDelta = truckRefills.Sum(x => x.Amount);
      var deliveryDelta = truck.Route.Refills.Where(x => x.ActualDeliveryDate == date).Sum(x => x.AmountDelivered);
      return dailyState.MorningQuantity + refillDelta - deliveryDelta;
    }
  }
}