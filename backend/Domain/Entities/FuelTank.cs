using Domain.Common;
using Domain.Enums;

namespace Domain.Entities
{
  public class FuelTank : AuditableEntity
  {
    public int Id { get; set; }
    public TankType Type { get; set; }
    public int TankNumber { get; set; }
    public double TankCapacity { get; set; }
    public double MinimumFuelAmount { get; set; }
  }
}