using Domain.Common;
using Domain.Enums;

namespace Domain.Entities
{
  public class Location : AuditableEntity
  {
    public int Id { get; set; }
    public int RegionId { get; set; }
    public Region Region { get; set; }
    public FuelTank FuelTank { get; set; }
    public int FuelTankId { get; set; }
    public RefillSchedule Schedule { get; set; }
    public string Address { get; set; }
    public string Comments { get; set; }
    //TODO: CO-68 Introduces address to this entity, should in the future probably be changed such that it relates to the street entity either directly or indirectly through a dedicated "address entity".
  }
}
