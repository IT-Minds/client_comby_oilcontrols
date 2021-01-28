using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using MediatR;

namespace Application.Locations.Commands.UpdateDebtorOnLocation
{
  public class UpdateDebtorOnLocationCommand : IRequest<int>
  {
    public int LocationId { get; set; }
    public int DebtorId { get; set; }

    public class UpdateDebtorOnLocationCommandHandler : IRequestHandler<UpdateDebtorOnLocationCommand, int>
    {
      private readonly IApplicationDbContext _context;

      public UpdateDebtorOnLocationCommandHandler(IApplicationDbContext context)
      {
        _context = context;
      }
      public Task<int> Handle(UpdateDebtorOnLocationCommand request, CancellationToken cancellationToken)
      {
        throw new System.NotImplementedException();
      }
    }
  }
}