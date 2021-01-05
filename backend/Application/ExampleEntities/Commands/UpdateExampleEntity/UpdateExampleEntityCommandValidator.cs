using FluentValidation;

namespace Application.ExampleEntities.Commands.UpdateExampleEntity
{
  public class UpdateExampleEntityCommandValidator : AbstractValidator<UpdateExampleEntityCommand>
  {

    public UpdateExampleEntityCommandValidator()
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
