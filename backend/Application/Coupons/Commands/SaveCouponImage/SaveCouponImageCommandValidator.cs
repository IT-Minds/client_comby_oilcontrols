using FluentValidation;

namespace Application.Coupons.Commands.SaveCouponImage
{
  public class SaveCouponImageCommandValidator : AbstractValidator<SaveCouponImageCommand>
  {
    public SaveCouponImageCommandValidator()
    {
      RuleFor(e => e.Dto.RefillId)
          .NotNull()
          .GreaterThanOrEqualTo(0);
      RuleFor(e => e.Dto.File)
          .NotEmpty();
      RuleFor(e => e.Dto.File.ContentType)
        .NotEmpty()
        .Matches(@"(^image\/png$)|(^image\/webp$)");
    }
  }
}
