using FluentValidation;

namespace Application.ExampleEntities.Commands.CreateExampleEntity
{
  public class CreateExampleEntityCommandValidator : AbstractValidator<CreateExampleEntityCommand>
  {
    public CreateExampleEntityCommandValidator()
    {
      RuleFor(e => e.Name)
          .MaximumLength(200)
          .NotEmpty();
      RuleFor(e => e.ExampleEnum)
          .IsInEnum()
          .NotNull();
    }
  }
}
