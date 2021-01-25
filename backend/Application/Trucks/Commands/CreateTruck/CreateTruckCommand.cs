using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Entities;
using Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Trucks.Commands.CreateTruck
{
  public class CreateTruckCommand : IRequest<int>
  {
    public string TruckIdentifier { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public double TankCapacity { get; set; }

    public class CreateTruckCommandHandler : IRequestHandler<CreateTruckCommand, int>
    {
      private readonly IApplicationDbContext _context;

      public CreateTruckCommandHandler(IApplicationDbContext context)
      {
        _context = context;
      }

      public async Task<int> Handle(CreateTruckCommand request, CancellationToken cancellationToken)
      {
        var truck = new Truck
        {
          TruckIdentifier = request.TruckIdentifier,
          Name = request.Name,
          Description = request.Description,
          TankCapacity = request.TankCapacity
        };
        _context.Trucks.Add(truck);
        var result = await _context.SaveChangesAsync(cancellationToken);
        return truck.Id;
      }
    }
  }
}