using Application.Common.Mappings;
using Domain.Entities;
using Domain.Enums;

namespace Application.LocationHistories.Queries
{
  public class LocationHistoryDto : IAutoMap<LocationHistory>
  {
    public int Id { get; set; }
    public int RegionId { get; set; }
    public RefillSchedule Schedule { get; set; }
    public string Address { get; set; }
    public string Comments { get; set; }
    public int LocationId { get; set; }
  }
}