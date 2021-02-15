namespace Application.Coupons.Queries.GetCouponImage
{
  public class ImageResponseDto
  {
    public byte[] Stream { get; set; }
    public int RefillId { get; set; }
    public int CouponId { get; set; }
  }
}