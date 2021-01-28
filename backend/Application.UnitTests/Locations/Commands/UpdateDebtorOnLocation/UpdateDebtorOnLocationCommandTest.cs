using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Locations.Commands.UpdateDebtorOnLocation;
using Domain.Enums;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace Application.UnitTests.Locations.Commands.UpdateDebtorOnLocation
{
  public class UpdateDebtorOnLocationCommandTest : CommandTestBase
  {
    [Fact]
    public async Task Handle_PersistChanges()
    {
      var command = new UpdateDebtorOnLocationCommand
      {
        LocationId = 401,
        DebtorId = 1,
        DebtorType = LocationDebtorType.BASE
      };
      var handler = new UpdateDebtorOnLocationCommand.UpdateDebtorOnLocationCommandHandler(Context);
      var result = await handler.Handle(command, CancellationToken.None);

      var entity = Context.LocationDebtors.FirstOrDefault(x => x.LocationId == command.LocationId && x.DebtorId == command.DebtorId && x.Type == command.DebtorType);

      entity.Should().NotBeNull();
    }

    [Fact]
    public async Task Handle_NoSuchLocation()
    {
      var command = new UpdateDebtorOnLocationCommand
      {
        LocationId = -400,
        DebtorId = 1,
        DebtorType = LocationDebtorType.BASE
      };
      var handler = new UpdateDebtorOnLocationCommand.UpdateDebtorOnLocationCommandHandler(Context);
      await Assert.ThrowsAsync<ArgumentException>(
        async () => { await handler.Handle(command, CancellationToken.None); }
      );
    }

    [Fact]
    public async Task Handle_NoSuchDebtor()
    {
      var command = new UpdateDebtorOnLocationCommand
      {
        LocationId = 400,
        DebtorId = -1,
        DebtorType = LocationDebtorType.BASE
      };
      var handler = new UpdateDebtorOnLocationCommand.UpdateDebtorOnLocationCommandHandler(Context);
      await Assert.ThrowsAsync<ArgumentException>(
        async () => { await handler.Handle(command, CancellationToken.None); }
      );
    }

    [Fact]
    public async Task Handle_TypeUpcomingNoDate()
    {
      var command = new UpdateDebtorOnLocationCommand
      {
        LocationId = 400,
        DebtorId = 1,
        DebtorType = LocationDebtorType.UPCOMING
      };

      var handler = new UpdateDebtorOnLocationCommand.UpdateDebtorOnLocationCommandHandler(Context);

      await Assert.ThrowsAsync<ArgumentException>(
        async () => { await handler.Handle(command, CancellationToken.None); }
      );
    }

    [Fact]
    public async Task Handle_DebtorOfTypeAlreadyExists()
    {
      var command = new UpdateDebtorOnLocationCommand
      {
        LocationId = 400,
        DebtorId = 1,
        DebtorType = LocationDebtorType.BASE
      };
      var handler = new UpdateDebtorOnLocationCommand.UpdateDebtorOnLocationCommandHandler(Context);


      await Assert.ThrowsAsync<ArgumentException>(
        async () => { await handler.Handle(command, CancellationToken.None); }
      );
    }
  }
}