
using Application.Common.Interfaces;
using Application.Common.Security;
using AutoMapper;
using Domain.Entities;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Trucks.Commands.CreateTruck
{
  [AuthorizeAttribute(Domain.Enums.Action.CREATE_TRUCK)]
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
        var driver = await _context.Users.FindAsync(request.TruckInfo.DriverId);

        // TODO check driver isn't null
        // TODO check if driver doesn't have role
        // TODO check driver doesn't driver another truck

        var truck = new Truck
        {
          TruckIdentifier = request.TruckInfo.TruckIdentifier,
          Name = request.TruckInfo.Name,
          Description = request.TruckInfo.Description,
          TankCapacity = request.TruckInfo.TankCapacity,
          Driver = driver
        };
        _context.Trucks.Add(truck);
        await _context.SaveChangesAsync(cancellationToken);

        return _mapper.Map<TruckInfoIdDto>(truck);
      }
    }
  }
}
