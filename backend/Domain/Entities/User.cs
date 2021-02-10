using System.Collections.Generic;
using Domain.Common;

namespace Domain.Entities
{
  public class User : AuditableEntity
  {
    public int Id { get; set; }

    public Truck Truck { get; set; }
    public int? TruckId { get; set; }

    public ICollection<UserRole> Roles { get; set; }
    public string Username { get; set; }
    public string Password { get; set; }
  }
}
