using FluentValidation;

namespace Application.Trucks.Commands.CreateTruck
{
  public class CreateTruckCommandValidator : AbstractValidator<CreateTruckCommand>
  {
    public CreateTruckCommandValidator()
    {
      RuleFor(e => e.TruckInfo)
        .NotNull();
      RuleFor(e => e.TruckInfo.TruckIdentifier)
        .NotEmpty();
    }
  }
}
