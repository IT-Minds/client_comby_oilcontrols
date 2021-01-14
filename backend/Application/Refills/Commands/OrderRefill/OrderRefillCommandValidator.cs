using Application.Refills.Commands.OrderRefill;
using FluentValidation;

namespace Application.Refills.Commands.CreateRefill
{
  public class OrderRefillCommandValidator : AbstractValidator<OrderRefillCommand>
  {
    public OrderRefillCommandValidator()
    {
      RuleFor(e => e.ExpectedDeliveryDate)
        .NotNull();
      RuleFor(e => e.LocationId)
        .NotNull();
      RuleFor(e => e.RouteId)
        .NotNull();
    }
  }
}
