using System;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Security;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Debtors.PrintCouponRequired
{
  [AuthorizeAttribute(Domain.Enums.Action.SET_DEBTOR_COUPON_REQUIRED)]
  public class PrintCouponRequiredCommand : IRequest<int>
  {
    [JsonIgnore]
    public int DebtorId { get; set; }
    public bool PrintCouponRequired { get; set; }

    public class PrintCouponRequiredCommandHandler : IRequestHandler<PrintCouponRequiredCommand, int>
    {
      private readonly IApplicationDbContext _context;

      public PrintCouponRequiredCommandHandler(IApplicationDbContext context)
      {
        _context = context;
      }

      public async Task<int> Handle(PrintCouponRequiredCommand request, CancellationToken cancellationToken)
      {
        var debtor = await _context.Debtors.FirstOrDefaultAsync(x => x.Id == request.DebtorId);
        if (debtor == null)
        {
          throw new ArgumentException("Debtor with ID: " + request.DebtorId + "doesn't exist.");
        }
        debtor.CouponRequired = request.PrintCouponRequired;
        _context.Debtors.Update(debtor);
        await _context.SaveChangesAsync(cancellationToken);
        return debtor.Id;
      }
    }
  }
}