using Domain.Common;
using Domain.Enums;

namespace Domain.Entities
{
  public class Location : AuditableEntity
  {
    public int Id { get; set; }
    public TankType Type { get; set; }
    public int TankNumber { get; set; }
    public int RegionId { get; set; }
    public Region Region { get; set; }
    //TODO: CO-68 Introduces address to this entity, should in the future probably be changed such that it relates to the street entity either directly or indirectly through a dedicated "address entity".
  }
}
