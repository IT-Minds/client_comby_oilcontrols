using FluentValidation;

namespace Application.Trucks.Commands.UpdateTruck
{
  public class UpdateTruckCommandValidator : AbstractValidator<UpdateTruckCommand>
  {
    public UpdateTruckCommandValidator()
    {
      RuleFor(e => e.TruckIdentifier)
        .NotEmpty();
    }
  }
}