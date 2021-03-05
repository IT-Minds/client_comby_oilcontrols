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

      foreach (var debtor in uniDebtors)
      {
        var debtorExists = dbDebtors.Where(x => x.UnicontaId == debtor.RowId).FirstOrDefault();
        if (debtorExists == null)
        {
          debtorExists = new Debtor
          {
            UnicontaId = debtor.RowId,
          };
        }
        debtorExists.Blocked = debtor.Blocked;
        debtorExists.AccountNumber = debtor.AccountNumber;
        debtorExists.Name = debtor.Name;
        debtorExists.GLN = debtor.GLN;

        _context.Debtors.Update(debtorExists);
      }

      await _context.SaveChangesAsync(cancellationToken);
    }
  }
}
