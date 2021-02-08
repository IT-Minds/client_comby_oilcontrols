using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;

namespace Application.Locations
{
  public class LocationDetailsDto : LocationDto, IAutoMap<Location>
  {
    public TankType TankType { get; set; }
    public int TankNumber { get; set; }
    public double TankCapacity { get; set; }
    public double MinimumFuelAmount { get; set; }
    public FuelType FuelType { get; set; }

    public void Mapping(Profile profile)
    {
      profile.CreateMap<Location, LocationDetailsDto>()
        .IncludeBase<Location, LocationDto>()

        .ForMember(x => x.TankType, opts => opts.MapFrom(from => from.FuelTank.TankType))
        .ForMember(x => x.TankNumber, opts => opts.MapFrom(from => from.FuelTank.TankNumber))
        .ForMember(x => x.TankCapacity, opts => opts.MapFrom(from => from.FuelTank.TankCapacity))
        .ForMember(x => x.MinimumFuelAmount, opts => opts.MapFrom(from => from.FuelTank.MinimumFuelAmount))
        .ForMember(x => x.FuelType, opts => opts.MapFrom(from => from.FuelTank.FuelType))
        ;
    }

  }
}
