using Domain.Common;
using Domain.Enums;

namespace Domain.Entities
{
  public class FuelTank : AuditableEntity
  {
    public int Id { get; set; }
    public FuelType FuelType { get; set; }
    public double TankCapacity { get; set; }
    public double MinimumFuelAmount { get; set; }
  }
}
