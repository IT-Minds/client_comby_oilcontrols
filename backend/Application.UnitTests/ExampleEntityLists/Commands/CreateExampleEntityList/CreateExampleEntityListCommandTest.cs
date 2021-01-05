using Application.ExampleEntityLists.Commands.CreateExampleEntityList;
using FluentAssertions;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace Application.UnitTests.ExampleEntityLists.Commands.CreateExampleEntityList
{
  public class CreateExampleEntityListCommandTest : CommandTestBase
  {
    [Fact]
    public async Task Handle_ShouldPersistExampleEntityList()
    {
      var command = new CreateExampleEntityListCommand
      {
        Name = "CreateTest"
      };

      var handler = new CreateExampleEntityListCommand.CreateExampleEntityListCommandHandler(Context);

      var result = await handler.Handle(command, CancellationToken.None);

      var entity = Context.ExampleEntityLists.Find(result);

      entity.Should().NotBeNull();
      entity.Name.Should().Be(command.Name);
    }

  }
}
