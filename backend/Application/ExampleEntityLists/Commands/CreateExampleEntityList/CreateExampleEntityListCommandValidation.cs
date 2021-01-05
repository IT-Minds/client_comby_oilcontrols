using FluentValidation;

namespace Application.ExampleEntityLists.Commands.CreateExampleEntityList
{
  public class CreateExampleEntityListCommandValidation : AbstractValidator<CreateExampleEntityListCommand>
  {
    public CreateExampleEntityListCommandValidation()
    {
      RuleFor(e => e.Name)
          .MaximumLength(200)
          .NotEmpty();
    }
  }
}
