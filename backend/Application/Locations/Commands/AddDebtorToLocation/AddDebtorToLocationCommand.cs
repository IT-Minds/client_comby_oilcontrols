using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Security;
using Domain.Entities;
using Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Locations.Commands.AddDebtorToLocation
{
  [AuthorizeAttribute(Domain.Enums.Action.UPDATE_LOCATION)]
  public class AddDebtorToLocationCommand : IRequest<int>
  {
    public int LocationId { get; set; }
    public int DebtorId { get; set; }
    public LocationDebtorType DebtorType { get; set; }
    public DateTime? ChangeDate { get; set; }

    public class AddDebtorToLocationCommandHandler : IRequestHandler<AddDebtorToLocationCommand, int>
    {
      private readonly IApplicationDbContext _context;

      public AddDebtorToLocationCommandHandler(IApplicationDbContext context)
      {
        _context = context;
      }
      public async Task<int> Handle(AddDebtorToLocationCommand request, CancellationToken cancellationToken)
      {
        if (request.ChangeDate == null && request.DebtorType == LocationDebtorType.UPCOMING)
        {
          throw new ArgumentException("Cannot have LocationDebtorType.UPCOMING and no ChangeDate.");
        }

        var location = await _context.Locations
          .Include(e => e.Debtors)
          .FirstOrDefaultAsync(x => x.Id == request.LocationId);
        if (location == null)
        {
          throw new ArgumentException("No location with ID: " + request.LocationId);
        }

        if (location.Debtors.Count() >= 3)
        {
          throw new ArgumentException("Not possible to add more debtors to location with ID: " + request.LocationId);
        }

        if (location.Debtors.FirstOrDefault(x => x.Type == request.DebtorType) != null)
        {
          throw new ArgumentException("Debtor of type " + request.DebtorType + " is already registered on location.");
        }

        if (location.Debtors.FirstOrDefault(x => x.DebtorId == request.DebtorId) != null)
        {
          throw new ArgumentException("Debtor " + request.DebtorId + " is already registered on location.");
        }

        var debtor = await _context.Debtors
          .Include(e => e.Locations)
          .FirstOrDefaultAsync(x => x.Id == request.DebtorId);
        if (debtor == null)
        {
          throw new ArgumentException("No debtor with ID: " + request.DebtorId);
        }

        var locationDebtor = new LocationDebtor
        {
          LocationId = request.LocationId,
          DebtorId = request.DebtorId,
          Type = request.DebtorType,
          DebtorChangeDate = request.ChangeDate
        };
        _context.LocationDebtors.Add(locationDebtor);
        await _context.SaveChangesAsync(cancellationToken);
        return location.Id;
      }
    }
  }
}
