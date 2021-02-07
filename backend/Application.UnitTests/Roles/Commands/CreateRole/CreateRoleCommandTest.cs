using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Roles;
using Application.Roles.Commands.CreateRole;
using Domain.Enums;
using FluentAssertions;
using Xunit;

namespace Application.UnitTests.Roles.Commands.CreateRole
{
  public class CreateRoleCommandTest : CommandTestBase
  {
    [Fact]
    public async Task Handle_PersistRole()
    {
      var dto = new RoleDto
      {
        Name = "testrole",
        Actions = new List<Domain.Enums.Action>() { Domain.Enums.Action.ASSIGN_COUPON, Domain.Enums.Action.CREATE_LOCATION }
      };
      var command = new CreateRoleCommand
      {
        Role = dto
      };
      var handler = new CreateRoleCommand.CreateRoleCommandHandler(Context, null);
      var result = await handler.Handle(command, CancellationToken.None);
      var entity = Context.Roles.Find(result.Id);

      entity.Should().NotBeNull();
      entity.Name.Should().Be(dto.Name);
      result.Name.Should().Be(dto.Name);
      entity.Actions.Count().Should().Be(dto.Actions.Count());
      result.Actions.Count().Should().Be(dto.Actions.Count());
    }

    [Fact]
    public async Task Handle_PersistRoleNoActions()
    {
      var dto = new RoleDto
      {
        Name = "testrole",
        Actions = new List<Domain.Enums.Action>()
      };
      var command = new CreateRoleCommand
      {
        Role = dto
      };
      var handler = new CreateRoleCommand.CreateRoleCommandHandler(Context, null);
      var result = await handler.Handle(command, CancellationToken.None);
      var entity = Context.Roles.Find(result.Id);

      entity.Should().NotBeNull();
      entity.Name.Should().Be(dto.Name);
      result.Name.Should().Be(dto.Name);
      entity.Actions.Should().BeNull();
      result.Actions.Count().Should().Be(0);
    }

    [Fact]
    public async Task Handle_ActionsNull()
    {
      var dto = new RoleDto
      {
        Name = "testrole",
      };
      var command = new CreateRoleCommand
      {
        Role = dto
      };
      var handler = new CreateRoleCommand.CreateRoleCommandHandler(Context, null);
      var result = await handler.Handle(command, CancellationToken.None);
      var entity = Context.Roles.Find(result.Id);

      entity.Should().NotBeNull();
      entity.Name.Should().Be(dto.Name);
      result.Name.Should().Be(dto.Name);
      entity.Actions.Should().BeNull();
      result.Actions.Count().Should().Be(0);
    }
  }
}