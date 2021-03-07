using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using UniContaDomain.Entities;

namespace Application.Common.Services
{
  public class SynchronizeDebtorService
  {
    private readonly IApplicationDbContext _context;
    private readonly IUniContaService _uniContaService;
    private readonly object ensureCreatedLock = new object();

    public SynchronizeDebtorService(IApplicationDbContext context, IUniContaService uniContaService)
    {
      _context = context;
      _uniContaService = uniContaService;
    }

    public async Task SyncroniceDebtor(CancellationToken cancellationToken)
    {
      try
      {
        if (!await _uniContaService.Login())
        {
          throw new ValidationException();
        }
      }
      catch (System.FormatException)
      {
        throw new ValidationException();
      }


      var uniDebtors = await _uniContaService.GetDebtors();
      await EnsureCreatedDebtors(uniDebtors, cancellationToken);
    }

    private async Task EnsureCreatedDebtors(IEnumerable<UniContaDebtor> uniDebtors, CancellationToken cancellationToken)
    {
      var uniDebtorIds = uniDebtors.Select(x => x.RowId);
      var dbDebtors = await _context.Debtors.AsQueryable()
        .Where(x => uniDebtorIds.Contains(x.UnicontaId))
        .ToListAsync();

      foreach (var uniDebtor in uniDebtors)
      {
        var debtor = dbDebtors.Where(x => x.UnicontaId == uniDebtor.RowId).FirstOrDefault();
        if (debtor == null)
        {
          debtor = new Debtor
          {
            UnicontaId = uniDebtor.RowId,
          };
          _context.Debtors.Add(debtor);
        } else {
          _context.Debtors.Update(debtor);
        }
        debtor.Blocked = uniDebtor.Blocked;
        debtor.AccountNumber = uniDebtor.AccountNumber;
        debtor.Name = uniDebtor.Name;
        debtor.GLN = uniDebtor.GLN;
      }

      await _context.SaveChangesAsync(cancellationToken);
    }
  }
}
