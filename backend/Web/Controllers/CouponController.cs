using Application.Coupons.Commands.SaveCouponImage;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Web.Controllers
{

  public class CouponController : ApiControllerBase
  {
        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<string>> CreateProjectFile(IFormFile file, int refillId)
        {
            return await Mediator.Send(new SaveCouponImageCommand
            {
                File = file,
                RefillId = refillId
            });
        }
  }
}
