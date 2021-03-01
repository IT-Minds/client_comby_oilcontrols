using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Users.Commands.DeleteUser;
using FluentAssertions;
using Xunit;

namespace Application.UnitTests.Users.Commands.DeleteUser
{
  public class DeleteUserCommandTest : CommandTestBase
  {
    [Fact]
    public async Task Handle_DeleteUser()
    {
      var command = new DeleteUserCommand
      {
        UserId = 700
      };
      var handler = new DeleteUserCommand.DeleteUserCommandHandler(Context, Mapper);
      var result = await handler.Handle(command, CancellationToken.None);
      result.Should().NotBeNull();
      var truck = Context.Trucks.Where(x => x.Id == result.TruckId);
      truck.Should().NotBeNull();
      var userRoles = Context.UserRoles.Where(x => x.UserId == command.UserId);
      userRoles.Should().BeEmpty();
      var user = Context.Users.Where(x => x.Id == command.UserId);
      user.Should().BeEmpty();
    }

    [Fact]
    public async Task Handle_NoSuchUser()
    {
      var command = new DeleteUserCommand
      {
        UserId = -700
      };
      var handler = new DeleteUserCommand.DeleteUserCommandHandler(Context, Mapper);
      await Assert.ThrowsAsync<ArgumentException>(
        async () => { await handler.Handle(command, CancellationToken.None); }
      );
    }
  }
}