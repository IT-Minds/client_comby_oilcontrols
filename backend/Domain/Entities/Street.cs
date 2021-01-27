using Domain.Common;

namespace Domain.Entities
{
  public class Street : AuditableEntity
  {
    public int Id { get; set; }
    public string Name { get; set; }
    public int RegionId { get; set; }
    public Region Region { get; set; }
  }
}