using FluentValidation;

namespace Application.Coupons.Commands.AssignCoupons
{
  public class CreateExampleEntityCommandValidator : AbstractValidator<AssignCouponsCommand>
  {
    public CreateExampleEntityCommandValidator()
    {
      RuleFor(e => e.Dto.TruckId)
          .NotNull();
      RuleFor(e => e.Dto.CouponNumbers)
          .NotEmpty();
    }
  }
}
