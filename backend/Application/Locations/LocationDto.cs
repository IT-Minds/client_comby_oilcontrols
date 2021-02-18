using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;

namespace Application.Locations
{
  public class LocationDto: IAutoMap<Location>
  {
    public string Address { get; set; }
    public string AddressExtra { get; set; }
    public string Comments { get; set; }
    public int RegionId { get; set; }
    public RefillSchedule Schedule { get; set; }
    public double EstimateFuelConsumption { get; set; }
    public int DaysBetweenRefills { get; set; }


    public void Mapping(Profile profile)
    {
      profile.CreateMap<Location, LocationDto>();
    }

  }
}
