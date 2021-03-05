using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Debtors.PrintCouponRequired;
using Application.Debtors.Queries;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers
{

  public class DebtorController : ApiControllerBase
  {
    readonly ApplicationDbContext _context;
    public DebtorController(ApplicationDbContext context)
    {
      this._context = context;
    }

    [HttpGet]
    // [ResponseCache(Duration = 3600)] // 1 hour cache
    public async Task<ActionResult<List<DebtorDto>>> Get()
    {
      return await Mediator.Send(new GetDebtorQuery());
    }

    [HttpPut("{id}/CouponRequired")]
    public async Task<ActionResult<int>> PrintCouponRequired([FromRoute] int id, PrintCouponRequiredCommand command)
    {
      command.DebtorId = id;
      return await Mediator.Send(command);
    }

  }
}
