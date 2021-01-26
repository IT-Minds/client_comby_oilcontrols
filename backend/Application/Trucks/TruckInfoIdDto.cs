using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;

namespace Application.Trucks
{
  public class TruckInfoIdDto : TruckInfoDto, IAutoMap<Truck>
  {
    public int Id { get; set; }

    public void Mapping(Profile profile)
    {
      profile.CreateMap<Truck, TruckInfoIdDto>()
        .IncludeBase<Truck, TruckInfoDto>();
    }
  }
}
