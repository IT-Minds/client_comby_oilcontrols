using Application.Common.Exceptions;
using Application.ExampleEntities.Commands.UpdateExampleEntity;
using Domain.Enums;
using FluentAssertions;
using System;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace Application.UnitTests.ExampleEntities.Commands.UpdateExampleEntity
{
  public class UpdateExampleEntityCommandTest : CommandTestBase
  {
    [Fact]
    public async Task Handle_GivenValidId_ShouldUpdatePersistedExampleEntity()
    {
      var command = new UpdateExampleEntityCommand
      {
        Id = 1,
        Name = "TestUpdate",
        ExampleEnum = ExampleEnum.B
      };

      var handler = new UpdateExampleEntityCommand.UpdateExampleEntityCommandHandler(Context);

      await handler.Handle(command, CancellationToken.None);

      var entity = Context.ExampleEntities.Find(command.Id);

      entity.Should().NotBeNull();
      entity.Name.Should().Be(command.Name);
      entity.ExampleEntityListId.Should().Be(command.ExampleEntityListId);
      entity.ExampleEnum.Should().Be(command.ExampleEnum);
    }

    [Fact]
    public void Handle_GivenInvalidId_ThrowsException()
    {
      var command = new UpdateExampleEntityCommand
      {
        Id = 99,
        Name = "This entity doesn't exist."
      };

      var sut = new UpdateExampleEntityCommand.UpdateExampleEntityCommandHandler(Context);
      Func<Task> action = async () => await sut.Handle(command, CancellationToken.None);

      action.Should().Throw<NotFoundException>();
    }

    [Fact]
    public void Handle_GivenInvalidExampleEntityListId_ThrowsException()
    {
      var command = new UpdateExampleEntityCommand
      {
        Id = 1,
        Name = "This entity list doesn't exist.",
        ExampleEntityListId = 99,
        ExampleEnum = ExampleEnum.B
      };

      var sut = new UpdateExampleEntityCommand.UpdateExampleEntityCommandHandler(Context);
      Func<Task> action = async () => await sut.Handle(command, CancellationToken.None);

      action.Should().Throw<NotFoundException>();

    }
  }
}
