using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

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
      public async Task<int> Handle(RemoveDebtorFromLocationCommand request, CancellationToken cancellationToken)
      {
        var location = await _context.Locations
          .Include(e => e.Debtors)
          .FirstOrDefaultAsync(x => x.Id == request.LocationId);
        if (location == null)
        {
          throw new ArgumentException("No location with ID: " + request.LocationId);
        }

        var debtor = await _context.Debtors
          .Include(e => e.Locations)
          .FirstOrDefaultAsync(x => x.Id == request.DebtorId);
        if (location == null)
        {
          throw new ArgumentException("No debtor with ID: " + request.DebtorId);
        }

        var locationDebtor = await _context.LocationDebtors.FirstOrDefaultAsync(x => x.LocationId == request.LocationId && x.DebtorId == request.DebtorId);
        _context.LocationDebtors.Remove(locationDebtor);
        await _context.SaveChangesAsync(cancellationToken);

        return location.Id;
      }
    }
  }
}