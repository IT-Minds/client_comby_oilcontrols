using System;
using Domain.Entities.Refills;

namespace Domain.EntityExtensions
{
  public static class RefillExtensions
  {
    public static double AmountDelivered(this CompletedRefill refill)
    {
      // locations tank capacity -
      return Math.Abs(refill.StartAmount - refill.EndAmount);
    }
  }
}
