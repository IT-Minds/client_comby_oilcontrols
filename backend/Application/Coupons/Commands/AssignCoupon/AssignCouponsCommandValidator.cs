using FluentValidation;

namespace Application.Coupons.Commands.AssignCoupons
{
  public class AssignCouponsCommandValidator : AbstractValidator<AssignCouponsCommand>
  {
    public AssignCouponsCommandValidator()
    {
      RuleFor(e => e.Dto.TruckId)
          .NotNull();
      RuleFor(e => e.Dto.CouponNumbers)
          .NotEmpty();
    }
  }
}
