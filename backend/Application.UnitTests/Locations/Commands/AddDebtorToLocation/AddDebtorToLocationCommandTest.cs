using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Locations.Commands.AddDebtorToLocation;
using Domain.Enums;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace Application.UnitTests.Locations.Commands.AddDebtorToLocation
{
  public class AddDebtorToLocationTest : CommandTestBase
  {
    [Fact]
    public async Task Handle_PersistNewDebtorLocationRelation()
    {
      var command = new AddDebtorToLocationCommand
      {
        LocationId = 1,
        DebtorId = 1,
        DebtorType = LocationDebtorType.MAIN
      };

      var handler = new AddDebtorToLocationCommand.AddDebtorToLocationCommandHandler(Context);
      var result = await handler.Handle(command, CancellationToken.None);
      var entity = Context.LocationDebtors.FirstOrDefault(x => x.LocationId == command.LocationId && x.DebtorId == command.DebtorId && x.Type == command.DebtorType);

      entity.Should().NotBeNull();
      var location = Context.Locations.Include(x => x.Debtors).FirstOrDefault(x => x.Id == command.LocationId);
      location.Debtors.Count().Should().Be(1);
      location.Debtors.First().DebtorId.Should().Be(command.DebtorId);
      location.Debtors.First().Type.Should().Be(command.DebtorType);
      var debtor = Context.Debtors.Include(x => x.Locations).FirstOrDefault(x => x.Id == command.DebtorId);
      location.Debtors.Count().Should().Be(1);
      location.Debtors.First().LocationId.Should().Be(command.LocationId);
      location.Debtors.First().Type.Should().Be(command.DebtorType);
      var locationDebtorHist = Context.LocationDebtorHistories.FirstOrDefault(x => x.DebtorId == debtor.Id && x.LocationId == location.Id);
      locationDebtorHist.Should().NotBeNull();
    }

    [Fact]
    public async Task Handle_NoSuchLocation()
    {
      var command = new AddDebtorToLocationCommand
      {
        LocationId = -1,
        DebtorId = 1,
        DebtorType = LocationDebtorType.MAIN
      };

      var handler = new AddDebtorToLocationCommand.AddDebtorToLocationCommandHandler(Context);

      await Assert.ThrowsAsync<ArgumentException>(
        async () => { await handler.Handle(command, CancellationToken.None); }
      );
    }

    [Fact]
    public async Task Handle_NoSuchDebtor()
    {
      var command = new AddDebtorToLocationCommand
      {
        LocationId = 1,
        DebtorId = -1,
        DebtorType = LocationDebtorType.MAIN
      };

      var handler = new AddDebtorToLocationCommand.AddDebtorToLocationCommandHandler(Context);

      await Assert.ThrowsAsync<ArgumentException>(
        async () => { await handler.Handle(command, CancellationToken.None); }
      );
    }

    [Fact]
    public async Task Handle_TypeUpcomingNoDate()
    {
      var command = new AddDebtorToLocationCommand
      {
        LocationId = 1,
        DebtorId = 1,
        DebtorType = LocationDebtorType.UPCOMING
      };

      var handler = new AddDebtorToLocationCommand.AddDebtorToLocationCommandHandler(Context);

      await Assert.ThrowsAsync<ArgumentException>(
        async () => { await handler.Handle(command, CancellationToken.None); }
      );
    }

    [Fact]
    public async Task Handle_DebtorOfTypeAlreadyExists()
    {
      var command = new AddDebtorToLocationCommand
      {
        LocationId = 1,
        DebtorId = 1,
        DebtorType = LocationDebtorType.MAIN
      };
      var handler = new AddDebtorToLocationCommand.AddDebtorToLocationCommandHandler(Context);
      await handler.Handle(command, CancellationToken.None);

      var command2 = new AddDebtorToLocationCommand
      {
        LocationId = 1,
        DebtorId = 2,
        DebtorType = LocationDebtorType.MAIN
      };
      await Assert.ThrowsAsync<ArgumentException>(
        async () => { await handler.Handle(command2, CancellationToken.None); ; }
      );
    }
  }
}