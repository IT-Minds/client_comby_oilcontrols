using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using MediatR;

namespace Application.Locations.Commands.RemoveDebtorFromLocation
{
  public class RemoveDebtorFromLocationCommand : IRequest<int>
  {
    public int LocationId { get; set; }
    public int DebtorId { get; set; }

    public class RemoveDebtorFromLocationCommandHandler : IRequestHandler<RemoveDebtorFromLocationCommand, int>
    {
      private readonly IApplicationDbContext _context;

      public RemoveDebtorFromLocationCommandHandler(IApplicationDbContext context)
      {
        _context = context;
      }
      public Task<int> Handle(RemoveDebtorFromLocationCommand request, CancellationToken cancellationToken)
      {
        throw new System.NotImplementedException();
      }
    }
  }
}