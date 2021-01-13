using FluentValidation;

namespace Application.Refills.Commands.CreateRefill
{
  public class CreateRefillCommandValidator : AbstractValidator<CreateRefillCommand>
  {
    public CreateRefillCommandValidator()
    {
      RuleFor(e => e.TruckId)
        .NotNull();
      RuleFor(e => e.TankNumber)
        .NotNull();
      RuleFor(e => e.StartAmount)
        .NotNull();
      RuleFor(e => e.EndAmount)
        .NotNull();
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
      RuleFor(e => e.ExpectedDeliveryDate)
        .NotNull();
    }
  }
}
