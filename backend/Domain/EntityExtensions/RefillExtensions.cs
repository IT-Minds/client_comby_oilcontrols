using Domain.Entities;

namespace Domain.EntityExtensions
{
  public static class RefillExtensions
  {
    public static double AmountDelivered(this Refill refill)
    {
      return refill.EndAmount - refill.StartAmount;
    }
  }
}