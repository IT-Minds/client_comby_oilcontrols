using FluentValidation;

namespace Application.Refills.Commands.CompleteRefill
{
  public class CreateRefillCommandValidator : AbstractValidator<CompleteRefillCommand>
  {
    public CreateRefillCommandValidator()
    {
      RuleFor(e => e.Id)
        .NotNull();
      RuleFor(e => e.StartAmount)
        .NotNull();
      RuleFor(e => e.EndAmount)
        .NotNull();
      RuleFor(e => e.CouponNumber)
        .NotNull();
      RuleFor(e => e.TankState)
        .IsInEnum()
        .NotNull();
      RuleFor(e => e.ActualDeliveryDate)
        .NotNull();
    }
  }
}
