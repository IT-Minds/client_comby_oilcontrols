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
  }
}
