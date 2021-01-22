using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Trucks.Commands.UpdateTruck;
using FluentAssertions;
using Xunit;

namespace Application.UnitTests.Trucks.Commands.UpdateTruck
{
  public class UpdateTruckCommandTest : CommandTestBase
  {
    [Fact]
    public async Task Handle_ShouldPersistUpdates()
    {
      var command = new UpdateTruckCommand
      {
        Name = "McTruck",
        Description = "I'm lovin' it",
        TankCapacity = Math.PI,
        StartRefillNumber = 700,
        TruckIdentifier = "Truck3",
        NewTruckIdentifier = "7ruck"
      };

      var handler = new UpdateTruckCommand.UpdateTruckCommandHandler(Context);

      var result = await handler.Handle(command, CancellationToken.None);

      var entity = Context.Trucks.FirstOrDefault(x => x.TruckIdentifier.Equals(result));

      entity.Should().NotBeNull();
      entity.Name.Should().Be(command.Name);
      entity.Description.Should().Be(command.Description);
      entity.TankCapacity.Should().Be(command.TankCapacity);
      entity.DailyStates.OrderByDescending(x => x.Date).FirstOrDefault().StartRefillNumber.Should().Be(command.StartRefillNumber);
      entity.TruckIdentifier.Should().Be(command.NewTruckIdentifier);
    }

    [Fact]
    public async Task Handle_NoSuchTruck()
    {
      var command = new UpdateTruckCommand
      {
        Name = "McTruck",
        Description = "I'm lovin' it",
        TankCapacity = Math.PI,
        StartRefillNumber = 700,
        TruckIdentifier = "-1"
      };

      var handler = new UpdateTruckCommand.UpdateTruckCommandHandler(Context);

      await Assert.ThrowsAsync<ArgumentException>(
        async () => { await handler.Handle(command, CancellationToken.None); }
      );
    }
  }
}