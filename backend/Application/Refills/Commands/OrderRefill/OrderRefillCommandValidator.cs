using Application.Refills.Commands.OrderRefill;
using FluentValidation;

namespace Application.Refills.Commands.OrderRefill
{
  public class OrderRefillCommandValidator : AbstractValidator<OrderRefillCommand>
  {
    public OrderRefillCommandValidator()
    {
      RuleFor(e => e.ExpectedDeliveryDate)
        .NotNull();
      RuleFor(e => e.LocationId)
        .NotNull();
      RuleFor(e => e.TruckId)
        .NotNull();
    }
  }
}
