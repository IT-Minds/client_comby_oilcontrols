using FluentValidation;

namespace Application.Coupons.Commands.SaveCouponImage
{
  public class SaveCouponImageCommandValidator : AbstractValidator<SaveCouponImageCommand>
  {
    public SaveCouponImageCommandValidator()
    {
      RuleFor(e => e.RefillId)
          .NotNull()
          .GreaterThanOrEqualTo(0);
      RuleFor(e => e.File)
          .NotEmpty();
      RuleFor(e => e.File.ContentType)
        .NotEmpty()
        .Matches(@"(^image\/png$)|(^image\/webp$)");
    }
  }
}
