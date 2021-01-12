using Application.Refill.Commands.CreateRefill;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Application.Coupons.Commands.SaveCouponImage;
using Microsoft.AspNetCore.Http;

namespace Web.Controllers
{
  public class RefillController : ApiControllerBase
  {
    [HttpPost]
    public async Task<ActionResult<int>> Create(CreateRefillCommand command)
    {
      return await Mediator.Send(command);
    }

    [HttpPost("{id}")]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<string>> CreateProjectFile(int id, IFormFile file, int refillId)
    {
        return await Mediator.Send(new SaveCouponImageCommand
        {
            File = file,
            RefillId = refillId
        });
    }
  }
}
