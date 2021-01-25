
using Application.Common.Interfaces;
using AutoMapper;
using Domain.Entities;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Trucks.Commands.CreateTruck
{
  public class CreateTruckCommand : IRequest<TruckInfoIdDto>
  {
    public TruckInfoDto TruckInfo { get; set; }

    public class CreateTruckCommandHandler : IRequestHandler<CreateTruckCommand, TruckInfoIdDto>
    {
      private readonly IApplicationDbContext _context;
      private readonly IMapper _mapper;

      public CreateTruckCommandHandler(IApplicationDbContext context, IMapper mapper)
      {
        _context = context;
        _mapper = mapper;
      }

      public async Task<TruckInfoIdDto> Handle(CreateTruckCommand request, CancellationToken cancellationToken)
      {
        var truck = new Truck
        {
          TruckIdentifier = request.TruckInfo.TruckIdentifier,
          Name = request.TruckInfo.Name,
          Description = request.TruckInfo.Description,
          TankCapacity = request.TruckInfo.TankCapacity
        };
        _context.Trucks.Add(truck);
        await _context.SaveChangesAsync(cancellationToken);

        return _mapper.Map<TruckInfoIdDto>(truck);
      }
    }
  }
}
