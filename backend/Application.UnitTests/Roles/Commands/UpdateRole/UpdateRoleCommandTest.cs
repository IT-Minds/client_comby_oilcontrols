using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Roles;
using Application.Roles.Commands.CreateRole;
using Application.Roles.Commands.UpdateRole;
using Domain.Enums;
using FluentAssertions;
using Xunit;

namespace Application.UnitTests.Roles.Commands.UpdateRole
{
  public class UpdateRoleCommandTest : CommandTestBase
  {
    [Fact]
    public async Task Handle_PersistUpdatesToRole()
    {
      var dto = new RoleDto
      {
        Name = "Test Role",
        Actions = new List<Domain.Enums.Action>() { Domain.Enums.Action.ASSIGN_COUPON, Domain.Enums.Action.CREATE_LOCATION }
      };
      var command = new UpdateRoleCommand
      {
        Role = dto
      };
      var handler = new UpdateRoleCommand.UpdateRoleCommandHandler(Context, null);
      var result = await handler.Handle(command, CancellationToken.None);
      var entity = Context.Roles.Find(result.Id);

      entity.Should().NotBeNull();
      entity.Name.Should().Be(dto.Name);
      result.Name.Should().Be(dto.Name);
      entity.Actions.Count().Should().Be(dto.Actions.Count());
      result.Actions.Count().Should().Be(dto.Actions.Count());
    }

    [Fact]
    public async Task Handle_UpdateRoleNoActions()
    {
      var dto = new RoleDto
      {
        Name = "Test Role",
        Actions = new List<Domain.Enums.Action>()
      };
      var command = new UpdateRoleCommand
      {
        Role = dto
      };
      var handler = new UpdateRoleCommand.UpdateRoleCommandHandler(Context, null);
      var result = await handler.Handle(command, CancellationToken.None);
      var entity = Context.Roles.Find(result.Id);

      entity.Should().NotBeNull();
      entity.Name.Should().Be(dto.Name);
      result.Name.Should().Be(dto.Name);
      entity.Actions.Should().BeEmpty();
      result.Actions.Count().Should().Be(0);
    }

    [Fact]
    public async Task Handle_ActionsNull()
    {
      var dto = new RoleDto
      {
        Name = "Test Role",
      };
      var command = new UpdateRoleCommand
      {
        Role = dto
      };
      var handler = new UpdateRoleCommand.UpdateRoleCommandHandler(Context, null);
      var result = await handler.Handle(command, CancellationToken.None);
      var entity = Context.Roles.Find(result.Id);

      entity.Should().NotBeNull();
      entity.Name.Should().Be(dto.Name);
      result.Name.Should().Be(dto.Name);
      entity.Actions.Should().BeEmpty();
      result.Actions.Count().Should().Be(0);
    }

    [Fact]
    public async Task Handle_NoSuchRole()
    {
      var dto = new RoleDto
      {
        Name = "Role Test",
      };
      var command = new UpdateRoleCommand
      {
        Role = dto
      };
      var handler = new UpdateRoleCommand.UpdateRoleCommandHandler(Context, null);
      await Assert.ThrowsAsync<ArgumentException>(
          async () => {await handler.Handle(command, CancellationToken.None);}
      );
    }
  }
}