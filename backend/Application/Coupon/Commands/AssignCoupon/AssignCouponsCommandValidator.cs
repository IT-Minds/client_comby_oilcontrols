using FluentValidation;

namespace Application.Coupons.Commands.AssignCoupons
{
  public class CreateExampleEntityCommandValidator : AbstractValidator<AssignCouponsCommand>
  {
    public CreateExampleEntityCommandValidator()
    {
      RuleFor(e => e.TruckId)
          .NotNull();
      RuleFor(e => e.CouponNumbers)
          .NotEmpty();
    }
  }
}
