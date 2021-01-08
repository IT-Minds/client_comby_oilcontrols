using FluentValidation;

namespace Application.Refill.Commands.CreateRefill
{
  public class CreateRefillCommandValidator : AbstractValidator<CreateRefillCommand>
  {
    public CreateRefillCommandValidator()
    {
      RuleFor(e => e.TruckId)
        .NotNull();
      RuleFor(e => e.TankNumber)
        .NotNull();
      RuleFor(e => e.Amount)
        .NotNull()
        .GreaterThan(0);
      RuleFor(e => e.CouponNumber)
        .NotNull();
      RuleFor(e => e.TankType)
        .IsInEnum()
        .NotNull();
      RuleFor(e => e.FuelType)
        .IsInEnum()
        .NotNull();
      RuleFor(e => e.TankState)
        .IsInEnum()
        .NotNull();
      RuleFor(e => e.Date)
        .NotNull();
    }
  }
}
