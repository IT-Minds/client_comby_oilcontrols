using FluentValidation;

namespace Application.TruckRefills.Commands.CreateTruckRefill
{
  public class CreateTruckRefillCommandValidator : AbstractValidator<CreateTruckRefillCommand>
  {
    public CreateTruckRefillCommandValidator()
    {
      RuleFor(e => e.TruckId)
        .NotNull();
      RuleFor(e => e.TimeStamp)
        .NotNull();
      RuleFor(e => e.FuelCardNumber)
        .NotNull();
      RuleFor(e => e.Amount)
        .NotNull()
        .GreaterThanOrEqualTo(0.0);
      RuleFor(e => e.FuelType)
        .NotNull();
    }
  }
}