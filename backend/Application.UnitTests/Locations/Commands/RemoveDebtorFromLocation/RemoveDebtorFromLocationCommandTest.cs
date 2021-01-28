using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Locations.Commands.RemoveDebtorFromLocation;
using FluentAssertions;
using Xunit;

namespace Application.UnitTests.Locations.Commands.RemoveDebtorsFromLocation
{
  public class RemoveDebtorFromLocationCommandTest : CommandTestBase
  {
    [Fact]
    public async Task Handle_RemoveDebtorFromLocation()
    {
      var command = new RemoveDebtorFromLocationCommand
      {
        LocationId = 400,
        DebtorId = 1
      };
      var handler = new RemoveDebtorFromLocationCommand.RemoveDebtorFromLocationCommandHandler(Context);
      var result = await handler.Handle(command, CancellationToken.None);
      var locationDebtors = Context.LocationDebtors.FirstOrDefault(x => x.DebtorId == command.DebtorId && x.LocationId == command.LocationId);

      locationDebtors.Should().BeNull();
    }

    [Fact]
    public async Task Handle_NoSuchLocation()
    {
      var command = new RemoveDebtorFromLocationCommand
      {
        LocationId = -400,
        DebtorId = 1
      };
      var handler = new RemoveDebtorFromLocationCommand.RemoveDebtorFromLocationCommandHandler(Context);
      await Assert.ThrowsAsync<ArgumentException>(
        async () => { await handler.Handle(command, CancellationToken.None); }
      );
    }

    [Fact]
    public async Task Handle_NoSuchDebtor()
    {
      var command = new RemoveDebtorFromLocationCommand
      {
        LocationId = 400,
        DebtorId = -1
      };
      var handler = new RemoveDebtorFromLocationCommand.RemoveDebtorFromLocationCommandHandler(Context);
      await Assert.ThrowsAsync<ArgumentException>(
        async () => { await handler.Handle(command, CancellationToken.None); }
      );
    }
  }
}