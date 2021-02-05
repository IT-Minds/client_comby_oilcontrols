using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Domain.Entities;
using UniContaDomain.Entities;

namespace Application.Common.Services
{
  public class SyncroniceDebtorService
  {
    private readonly IApplicationDbContext _context;
    private readonly IUniContaService _uniContaService;
    private readonly object ensureCreatedLock = new object();

    private IQueryable<Debtor> _debtors;

    public SyncroniceDebtorService(IApplicationDbContext context, IUniContaService uniContaService)
    {
      _context = context;
      _uniContaService = uniContaService;

      _debtors = _context.Debtors.AsQueryable();
    }

    public async Task<List<(UniContaDebtor ucDebtor, Debtor dbDebtor)>> SyncroniceDebtor()
    {
      if (!await _uniContaService.Login())
      {
        // TODO throw exception???
      }

      var uniDebtors = await _uniContaService.GetDebtors();
      var dbDebtors = EnsureCreatedDebtors(uniDebtors.Select(x => x.RowId));

      if (uniDebtors.Count() != dbDebtors.Count())
      {
        // TODO throw exception???
      }

      var joinedList = uniDebtors
        .OrderBy(x => x.RowId)
        .Zip(dbDebtors.OrderBy(x => x.UnicontaId),
          (a, b) => (a,b))
        .ToList();

      return joinedList;
    }

    public void SetDebtorQuery(IQueryable<Debtor> debtors)
    {
      _debtors = debtors;
    }


    private List<Debtor> EnsureCreatedDebtors(IEnumerable<int> uniDebtorIds)
    {
      List<Debtor> dbDebtors;
      lock (ensureCreatedLock)
      {
        dbDebtors = _debtors
          .Where(x => uniDebtorIds.Contains(x.UnicontaId))
          .ToList();

        foreach (var id in uniDebtorIds)
        {
          if (!dbDebtors.Select(x => x.UnicontaId).Contains(id))
          {
            var newDebtor = new Debtor { UnicontaId = id };

            _context.Debtors.Add(newDebtor);
            dbDebtors.Add(newDebtor);
          }
        }
        _context.SaveChanges();
      }
      return dbDebtors;
    }
  }
}
