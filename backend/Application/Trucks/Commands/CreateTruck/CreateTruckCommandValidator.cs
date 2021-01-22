using FluentValidation;

namespace Application.Trucks.Commands.CreateTruck
{
  public class CreateTruckCommandValidator : AbstractValidator<CreateTruckCommand>
  {
    public CreateTruckCommandValidator()
    {
      RuleFor(e => e.TruckIdentifier)
        .NotEmpty();
    }
  }
}
