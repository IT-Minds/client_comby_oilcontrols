using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;
using Domain.EntityExtensions;

namespace Application.Trucks
{
  public class TruckInfoDto : IAutoMap<Truck>
  {
    public string TruckIdentifier { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public double TankCapacity { get; set; }
    public int RefillNumber { get; set; }

    public int? DriverId { get; set; }

    public void Mapping(Profile profile)
    {
      profile.CreateMap<Truck, TruckInfoDto>()
        .ForMember(dest => dest.DriverId,
          map => map.MapFrom(from => from.Driver.Id));
    }
  }
}
