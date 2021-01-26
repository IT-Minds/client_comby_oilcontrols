using System.Threading.Tasks;
using Application.Trucks.Queries.GetTruckInfo;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Uniconta.DataModel;

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
    public async Task<ActionResult<bool>> Get()
    {
      return await Mediator.Send(new GetDebtorQuery());
    }
  }
}
