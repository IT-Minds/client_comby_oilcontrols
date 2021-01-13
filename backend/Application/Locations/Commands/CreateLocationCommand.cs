using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using MediatR;

namespace Application.Locations.Commands.CreateLocation
{
  public class CreateLocationCommand : IRequest<int>
  {
    

    public class CreateLocationCommandHandler : IRequestHandler<CreateLocationCommand, int>
    {
      private readonly IApplicationDbContext _context;

      public CreateLocationCommandHandler(IApplicationDbContext context)
      {
        _context = context;  
      }
      
      public async Task<int> Handle(CreateLocationCommand request, CancellationToken cancellationToken)
      {
        throw new System.NotImplementedException();
      }
    }
  }
}