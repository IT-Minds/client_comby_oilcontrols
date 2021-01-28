using System.Linq;
using System.Threading;
using System.Threading.Tasks;
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
        Address = "This is address 23",
        Comment = "This is comment.",
        Refillschedule = RefillSchedule.AUTOMATIC,
        TankType = TankType.BUILDING,
        TankNumber = 9696,
        TankCapacity = 4005.1,
        MinimumFuelAmount = 50.5,
        EstimateConsumption = 10,
        FuelType = FuelType.GASOLINE,
        DaysBetweenRefills = 10,
        DebtorType = LocationDebtorType.BASE,
        DebtorId = 1
      };
      var oldLocation = Context.Locations.Find(1);
      var historyNumber = oldLocation.LocationHistories == null ? 0 : oldLocation.LocationHistories.Count();

      var handler = new CreateLocationCommand.CreateLocationCommandHandler(Context);
      var result = await handler.Handle(command, CancellationToken.None);

      var entity = Context.Locations.Find(result);
      var newestHistory = entity.LocationHistories.OrderByDescending(x => x.Created).FirstOrDefault();

      entity.Should().NotBeNull();
      entity.Address.Should().Be(command.Address);
      entity.Comments.Should().Be(command.Comment);
      entity.Schedule.Should().Be(command.Refillschedule);
      entity.DaysBetweenRefills.Should().Be(command.DaysBetweenRefills);
      entity.EstimateFuelConsumption.Should().Be(command.EstimateConsumption);
      entity.FuelTank.TankType.Should().Be(command.TankType);
      entity.FuelTank.TankNumber.Should().Be(command.TankNumber);
      entity.FuelTank.TankCapacity.Should().Be(command.TankCapacity);
      entity.FuelTank.MinimumFuelAmount.Should().Be(command.MinimumFuelAmount);
      entity.FuelTank.FuelType.Should().Be(command.FuelType);
      newestHistory.Should().NotBeNull();
      newestHistory.LocationId.Should().Be(entity.Id);
      newestHistory.RegionId.Should().Be(entity.RegionId);
      newestHistory.Schedule.Should().Be(entity.Schedule);
      newestHistory.Address.Should().Be(entity.Address);
      newestHistory.Comments.Should().Be(entity.Comments);
      entity.Debtors.Count().Should().Be(1);
      entity.Debtors.First().DebtorId.Should().Be(command.DebtorId);
      entity.Debtors.First().Type.Should().Be(command.DebtorType);
    }
  }
}
