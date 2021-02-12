using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Domain.EntityExtensions;
using Microsoft.EntityFrameworkCore;

namespace Application.Common.Services
{
  public class StatsService
  {

    private readonly IApplicationDbContext _context;

    public StatsService(IApplicationDbContext context)
    {
      _context = context;
    }

    public async Task<IEnumerable<CsvDto>> ReportRefillsOfYear(int year)
    {
      var refills = await _context.CompletedRefills
        .Include(x => x.Location)
          .ThenInclude(x => x.FuelTank)
        .Include(x => x.Location)
          .ThenInclude(x => x.Debtors)
            .ThenInclude(x => x.Debtor)
        .Where(x => x.ActualDeliveryDate.Year == year)
        .OrderBy(x => x.Location.Address)
          .ThenBy(x => x.ActualDeliveryDate)
        .ToListAsync();

      var result = refills.Select(x => new CsvDto {
        Date = x.ActualDeliveryDate,
        TankNumber = x.Location.FuelTank.TankNumber,
        Address = x.Location.Address,
        Name = x.Location.ActiveDebtor()?.UnicontaId.ToString() ?? "",
        Amount = x.AmountDelivered()
      });

      return result;
    }
  }

  public class CsvDto
  {
      public DateTime Date { get; set; }
      public string TankNumber { get; set; }
      public string Address { get; set; }
      public string Name { get; set; }
      public double Amount { get; set; }
  }
}
