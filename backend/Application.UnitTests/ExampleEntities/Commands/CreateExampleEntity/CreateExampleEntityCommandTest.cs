using Application.ExampleEntities.Commands.CreateExampleEntity;
using Domain.Enums;
using FluentAssertions;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace Application.UnitTests.ExampleEntities.Commands.CreateExampleEntity
{
  public class CreateExampleEntityCommandTest : CommandTestBase
  {
    [Fact]
    public async Task Handle_ShouldPersistExampleEntity()
    {
      var command = new CreateExampleEntityCommand
      {
        Name = "CreateTest",
        ExampleEnum = ExampleEnum.A
      };

      var handler = new CreateExampleEntityCommand.CreateExampleEntityCommandHandler(Context);

      var result = await handler.Handle(command, CancellationToken.None);

      var entity = Context.ExampleEntities.Find(result);

      entity.Should().NotBeNull();
      entity.Name.Should().Be(command.Name);
      entity.ExampleEnum.Should().Be(command.ExampleEnum);
    }
  }
}
