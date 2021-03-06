using System;
using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;
using Domain.EntityExtensions;

namespace Application.Trucks
{
  public class TruckInfoDetailsDto : TruckInfoIdDto, IAutoMap<Truck>
  {
    public double CurrentTankLevel { get; set; }

#pragma warning disable 0108
    public void Mapping(Profile profile)
    {
      profile.CreateMap<Truck, TruckInfoDetailsDto>()
        .IncludeBase<Truck, TruckInfoIdDto>()

        .ForMember(dest => dest.CurrentTankLevel,
          opts => opts.MapFrom(source => source.EveningQuantity(DateTime.UtcNow)));
      ;
    }
#pragma warning restore 0108
  }
}
