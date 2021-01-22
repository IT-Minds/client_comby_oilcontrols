using Domain.Entities;

namespace Domain.EntityExtensions
{
  public static class RefillExtensions
  {
    public static double? AmountDelivered(this Refill refill)
    {
      if (!refill.EndAmount.HasValue || !refill.StartAmount.HasValue) return null;
      return ((double)refill.EndAmount) - ((double)refill.StartAmount);
    }
  }
}
