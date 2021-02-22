using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Security;
using Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Locations.Commands.UpdateDebtorOnLocation
{
  [AuthorizeAttribute(Domain.Enums.Action.UPDATE_LOCATION)]
  public class UpdateDebtorOnLocationCommand : IRequest<int>
  {
    public int LocationId { get; set; }
    public int DebtorId { get; set; }
    public LocationDebtorType DebtorType { get; set; }
    public DateTime? ChangeDate { get; set; }

    public class UpdateDebtorOnLocationCommandHandler : IRequestHandler<UpdateDebtorOnLocationCommand, int>
    {
      private readonly IApplicationDbContext _context;

      public UpdateDebtorOnLocationCommandHandler(IApplicationDbContext context)
      {
        _context = context;
      }
      public async Task<int> Handle(UpdateDebtorOnLocationCommand request, CancellationToken cancellationToken)
      {
        if (request.ChangeDate == null && request.DebtorType == LocationDebtorType.UPCOMING)
        {
          throw new ArgumentException("Cannot have LocationDebtorType.UPCOMING and no ChangeDate.");
        }

        var location = await _context.Locations
          .Include(e => e.Debtors)
          .ThenInclude(e => e.Debtor)
          .FirstOrDefaultAsync(x => x.Id == request.LocationId);
        if (location == null)
        {
          throw new ArgumentException("No location with ID: " + request.LocationId);
        }

        if (location.Debtors.FirstOrDefault(x => x.Type == request.DebtorType) != null)
        {
          throw new ArgumentException("Debtor of type " + request.DebtorType + " is already registered on location.");
        }

        var locationDebtor = location.Debtors.FirstOrDefault(x => x.Debtor.Id == request.DebtorId);
        if (locationDebtor == null)
        {
          throw new ArgumentException("No debtor with ID " + request.DebtorId + " associated with location with ID " + request.LocationId);
        }
        locationDebtor.Type = request.DebtorType;
        locationDebtor.DebtorChangeDate = request.ChangeDate;

        await _context.SaveChangesAsync(cancellationToken);
        return location.Id;
      }
    }
  }
}