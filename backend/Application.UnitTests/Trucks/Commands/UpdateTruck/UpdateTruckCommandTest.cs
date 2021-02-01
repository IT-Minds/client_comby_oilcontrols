using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Trucks;
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
        Id = 100,
        TruckInfo = new TruckInfoIdDto
        {
          Name = "McTruck",
          Description = "I'm lovin' it",
          TankCapacity = Math.PI,
          RefillNumber = 700,
          Id = 100,
          TruckIdentifier = "7ruck"
        }
      };

      var handler = new UpdateTruckCommand.UpdateTruckCommandHandler(Context, Mapper);

      var result = await handler.Handle(command, CancellationToken.None);

      var entity = await Context.Trucks.FindAsync(result.Id);

      entity.Should().NotBeNull();
      entity.Id.Should().Be(command.Id);
      entity.Name.Should().Be(command.TruckInfo.Name);
      entity.Description.Should().Be(command.TruckInfo.Description);
      entity.TankCapacity.Should().Be(command.TruckInfo.TankCapacity);
      entity.RefillNumber.Should().Be(command.TruckInfo.RefillNumber);
      entity.TruckIdentifier.Should().Be(command.TruckInfo.TruckIdentifier);
    }

    [Fact]
    public async Task Handle_NoSuchTruck()
    {
      var command = new UpdateTruckCommand
      {TruckInfo = new TruckInfoIdDto
      {
        Name = "McTruck",
        Description = "I'm lovin' it",
        TankCapacity = Math.PI,
        RefillNumber = 700,
        TruckIdentifier = "-1",
        Id = -1
      }
      };

      var handler = new UpdateTruckCommand.UpdateTruckCommandHandler(Context, Mapper);

      await Assert.ThrowsAsync<ArgumentException>(
        async () => { await handler.Handle(command, CancellationToken.None); }
      );
    }
  }
}
