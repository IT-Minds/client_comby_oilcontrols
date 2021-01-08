using FluentValidation;

namespace Application.Refill.Commands.CreateRefill
{
  public class CreateRefillCommandValidator : AbstractValidator<CreateRefillCommand>
  {
    public CreateRefillCommandValidator()
    {
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
