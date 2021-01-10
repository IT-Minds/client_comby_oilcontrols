using FluentValidation;

namespace Application.ExampleEntities.Queries.GetExampleEntities.PageCreatedAt
{
  public class GetExampleEntitiesPageCreatedAtQueryValidator : AbstractValidator<GetExampleEntitiesPageCreatedAtQuery>
  {
    public GetExampleEntitiesPageCreatedAtQueryValidator()
    {
      RuleFor(e => e.Size).GreaterThan(0);
    }
  }
}
