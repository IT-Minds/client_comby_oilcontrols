using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Locations;
using Application.Locations.Commands.CreateLocation;
using Domain.Enums;
using FluentAssertions;
using Xunit;

namespace Application.UnitTests.Locations.Commands.CreateLocations
{
  public class CreateLocationCommandTest : CommandTestBase
  {
    [Fact(Skip = "Histories created async")]
    public async Task Handle_ShouldPersistNewData()
    {
      var command = new CreateLocationCommand
      {
        Data = new LocationDetailsDto {
          Address = "This is address 23",
          Comments = "This is comment.",
          Schedule = RefillSchedule.AUTOMATIC,
          TankType = TankType.BUILDING,
          TankNumber = 9696,
          TankCapacity = 4005.1,
          MinimumFuelAmount = 50.5,
          EstimateFuelConsumption = 10,
          FuelType = FuelType.GASOLINE,
          DaysBetweenRefills = 10
        }
      };
      var oldLocation = Context.Locations.Find(1);
      var historyNumber = oldLocation.LocationHistories == null ? 0 : oldLocation.LocationHistories.Count();

      var handler = new CreateLocationCommand.CreateLocationCommandHandler(Context);
      var result = await handler.Handle(command, CancellationToken.None);

      var entity = Context.Locations.Find(result);
      var newestHistory = entity.LocationHistories.OrderByDescending(x => x.Created).FirstOrDefault();

      entity.Should().NotBeNull();
      entity.Address.Should().Be(command.Data.Address);
      entity.Comments.Should().Be(command.Data.Comments);
      entity.Schedule.Should().Be(command.Data.Schedule);
      entity.DaysBetweenRefills.Should().Be(command.Data.DaysBetweenRefills);
      entity.EstimateFuelConsumption.Should().Be(command.Data.EstimateFuelConsumption);
      entity.FuelTank.TankType.Should().Be(command.Data.TankType);
      entity.FuelTank.TankNumber.Should().Be(command.Data.TankNumber);
      entity.FuelTank.TankCapacity.Should().Be(command.Data.TankCapacity);
      entity.FuelTank.MinimumFuelAmount.Should().Be(command.Data.MinimumFuelAmount);
      entity.FuelTank.FuelType.Should().Be(command.Data.FuelType);
      newestHistory.Should().NotBeNull();
      newestHistory.LocationId.Should().Be(entity.Id);
      newestHistory.RegionId.Should().Be(entity.RegionId);
      newestHistory.Schedule.Should().Be(entity.Schedule);
      newestHistory.Address.Should().Be(entity.Address);
      newestHistory.Comments.Should().Be(entity.Comments);
    }
  }
}
