using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;

namespace Application.Locations
{
  public class LocationDto : IAutoMap<Location>
  {
    public string Address { get; set; }
    public string Comment { get; set; }
    public int RegionId { get; set; }
    public RefillSchedule Refillschedule { get; set; }
    public TankType TankType { get; set; }
    public int TankNumber { get; set; }
    public double TankCapacity { get; set; }
    public double MinimumFuelAmount { get; set; }
    public double EstimateConsumption { get; set; }
    public int DaysBetweenRefills { get; set; }
    public FuelType FuelType { get; set; }
    public void Mapping(Profile profile)
    {
      profile.CreateMap<Truck, LocationDto>();
    }
  }
}
