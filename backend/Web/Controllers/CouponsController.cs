using Application.Common;
using Application.Coupons.Commands.AssignCoupons;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Web.Controllers
{

  public class CouponsController : ApiControllerBase
  {
    [HttpPost]
    public async Task<ActionResult<List<int>>> Create(AssignCouponsCommand command)
    {
      return await Mediator.Send(command);
    }

  }
}
