using Domain.Entities;
using Domain.Entities.Refills;

namespace Domain.EntityExtensions
{
  public static class RefillExtensions
  {
    public static double AmountDelivered(this CompletedRefill refill)
    {
      return refill.EndAmount - refill.StartAmount;
    }
  }
}
