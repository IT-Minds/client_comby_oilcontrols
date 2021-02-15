using Microsoft.AspNetCore.Http;

namespace Application.Coupons.Commands.SaveCouponImage
{
  public class CouponImageDto
  {
    public int RefillId { get; set; }
    public IFormFile File { get; set; }
  }
}