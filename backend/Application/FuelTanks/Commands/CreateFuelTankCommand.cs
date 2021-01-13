using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using MediatR;

namespace Application.FuelTanks.Commands.CreateFuelTank
{
  public class CreateFuelTankCommand : IRequest<int>
  {
    

    public class CreateFuelTankCommandHandler : IRequestHandler<CreateFuelTankCommand, int>
    {
      private readonly IApplicationDbContext _context;

      public CreateFuelTankCommandHandler(IApplicationDbContext context)
      {
        _context = context;  
      }
      
      public async Task<int> Handle(CreateFuelTankCommand request, CancellationToken cancellationToken)
      {
        throw new System.NotImplementedException();
      }
    }
  }
}