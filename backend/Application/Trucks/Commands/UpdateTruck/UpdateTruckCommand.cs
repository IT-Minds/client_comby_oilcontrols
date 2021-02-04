using System;
using System.Linq;
using Newtonsoft.Json;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using Application.Common.Security;

namespace Application.Trucks.Commands.UpdateTruck
{
  [AuthorizeAttribute(Domain.Enums.Action.UPDATE_TRUCK)]
  public class UpdateTruckCommand : IRequest<TruckInfoIdDto>
  {
    [JsonIgnore]
    public int Id { get; set; }
    public TruckInfoDto TruckInfo { get; set; }

    public class UpdateTruckCommandHandler : IRequestHandler<UpdateTruckCommand, TruckInfoIdDto>
    {
      private readonly IApplicationDbContext _context;
      private readonly IMapper _mapper;


      public UpdateTruckCommandHandler(IApplicationDbContext context, IMapper mapper)
      {
        _context = context;
        _mapper = mapper;
      }

      public async Task<TruckInfoIdDto> Handle(UpdateTruckCommand request, CancellationToken cancellationToken)
      {
        var truck = await _context.Trucks.FirstOrDefaultAsync(x => x.Id == request.Id);
        if (truck == null)
        {
          throw new ArgumentException("No truck with Truck Id: " + request.Id + ".");
        }

        truck.TruckIdentifier = request.TruckInfo.TruckIdentifier;
        truck.Description = request.TruckInfo.Description;
        truck.TankCapacity = request.TruckInfo.TankCapacity;
        truck.Name = request.TruckInfo.Name;
        truck.RefillNumber = request.TruckInfo.RefillNumber;

        await _context.SaveChangesAsync(cancellationToken);
        return _mapper.Map<TruckInfoIdDto>(truck);
      }
    }
  }
}
