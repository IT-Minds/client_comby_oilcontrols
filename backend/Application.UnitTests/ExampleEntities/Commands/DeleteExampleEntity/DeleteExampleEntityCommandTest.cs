using Application.Common.Exceptions;
using Application.ExampleEntities.Commands.DeleteExampleEntity;
using FluentAssertions;
using System;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace Application.UnitTests.ExampleEntities.Commands.DeleteExampleEntity
{
  public class DeleteExampleEntityCommandTest : CommandTestBase
  {
    [Fact]
    public async Task Handle_GivenValidId_ShouldRemovePersistedExampleEntity()
    {
      var command = new DeleteExampleEntityCommand
      {
        Id = 1
      };

      var handler = new DeleteExampleEntityCommand.DeleteExampleEntityCommandHandler(Context);

      await handler.Handle(command, CancellationToken.None);

      var entity = Context.ExampleEntities.Find(command.Id);

      entity.Should().BeNull();
    }

    [Fact]
    public void Handle_GivenInvalidId_ThrowsException()
    {
      var command = new DeleteExampleEntityCommand
      {
        Id = 99
      };

      var handler = new DeleteExampleEntityCommand.DeleteExampleEntityCommandHandler(Context);

      Func<Task> action = async () => await handler.Handle(command, CancellationToken.None);
      action.Should().Throw<NotFoundException>();
    }
  }
}
