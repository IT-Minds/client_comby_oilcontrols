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
      var dto = new UserRoleDto
      {
        Username = "LegitUser64",
        Role = "LittleLessImportant"
      };
      var command = new UpdateUserRolesCommand
      {
        User = dto
      };
      var handler = new UpdateUserRolesCommand.UpdateUserRolesCommandHandler(Context);
      var result = await handler.Handle(command, CancellationToken.None);

      var entity = await Context.Users
        .Include(x => x.Roles)
        .ThenInclude(x => x.Role)
        .Where(x => x.Username.Equals(dto.Username))
        .FirstOrDefaultAsync(CancellationToken.None);

      entity.Should().NotBeNull();
      entity.Roles.Count().Should().Be(1);
      entity.Roles.First().Role.Name.Should().Be("LittleLessImportant");
    }

    [Fact]
    public async Task Handle_NoSuchUser()
    {
      var dto = new UserRoleDto
      {
        Username = "Nyarlathotep",
        Role = "LittleLessImportant"
      };
      var command = new UpdateUserRolesCommand
      {
        User = dto
      };
      var handler = new UpdateUserRolesCommand.UpdateUserRolesCommandHandler(Context);

      await Assert.ThrowsAsync<ArgumentException>(
        async () => { await handler.Handle(command, CancellationToken.None); }
      );
    }

    [Fact]
    public async Task Handle_NoSuchRole()
    {
      var dto = new UserRoleDto
      {
        Username = "LegitUser64",
        Role = "The Nameless Mist"
      };
      var command = new UpdateUserRolesCommand
      {
        User = dto
      };
      var handler = new UpdateUserRolesCommand.UpdateUserRolesCommandHandler(Context);

      await Assert.ThrowsAsync<ArgumentException>(
        async () => { await handler.Handle(command, CancellationToken.None); }
      );
    }
  }
}