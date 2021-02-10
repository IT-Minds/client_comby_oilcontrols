using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Users.Commands.UpdateUserRole;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace Application.UnitTests.Users.Commands.UpdateUserRoles
{
  public class UpdateUSerRolesCommandTest : CommandTestBase
  {
    [Fact]
    public async Task Handle_PersistUpdates()
    {
      var command = new UpdateUserRolesCommand
      {
        Role = "LittleLessImportant",
        UserId = 500
      };
      var handler = new UpdateUserRolesCommand.UpdateUserRolesCommandHandler(Context, Mapper);
      var result = await handler.Handle(command, CancellationToken.None);

      var entity = await Context.Users
        .Include(x => x.Roles)
        .ThenInclude(x => x.Role)
        .FirstOrDefaultAsync(x => x.Id == command.UserId ,CancellationToken.None);

      entity.Should().NotBeNull();
      entity.Roles.Count().Should().Be(1);
      entity.Roles.First().Role.Name.Should().Be("LittleLessImportant");
    }

    [Fact]
    public async Task Handle_NoSuchUser()
    {
      var command = new UpdateUserRolesCommand
      {
        UserId = -1,
        Role = "LittleLessImportant"
      };
      var handler = new UpdateUserRolesCommand.UpdateUserRolesCommandHandler(Context, Mapper);

      await Assert.ThrowsAsync<ArgumentException>(
        async () => { await handler.Handle(command, CancellationToken.None); }
      );
    }

    [Fact]
    public async Task Handle_NoSuchRole()
    {
      var command = new UpdateUserRolesCommand
      {
         Role = "The Nameless Mist",
        UserId = 500
      };
      var handler = new UpdateUserRolesCommand.UpdateUserRolesCommandHandler(Context, Mapper);

      await Assert.ThrowsAsync<ArgumentException>(
        async () => { await handler.Handle(command, CancellationToken.None); }
      );
    }
  }
}
