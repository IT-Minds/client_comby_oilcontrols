using AutoMapper;
using Domain.Entities;

namespace Application.Trucks
{
  public class TruckInfoIdDto : TruckInfoDto
  {
    public int Id { get; set; }

#pragma warning disable 0108
    public void Mapping(Profile profile)
    {
      profile.CreateMap<Truck, TruckInfoIdDto>()
        .IncludeBase<Truck, TruckInfoDto>();
    }
#pragma warning restore 0108
  }
}
