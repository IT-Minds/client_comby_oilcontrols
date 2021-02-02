using Domain.Common;
using Domain.Enums;

namespace Domain.Entities
{
  public class RoleAction : AuditableEntity
  {
    public int RoleId { get; set; }
    public Role Role { get; set; }
    public Action Action { get; set; }
  }
}