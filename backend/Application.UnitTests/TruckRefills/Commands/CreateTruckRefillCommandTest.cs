using Domain.Enums;
using FluentAssertions;
using System.Threading;
using System.Threading.Tasks;
using Xunit;
using System;
using Application.TruckRefills.Commands.CreateTruckRefill;
using Application.Common.Exceptions;

namespace Application.UnitTests.TruckRefills.Commands.CreateTruckRefill
{
  public class CreateTruckRefillCommandTest : CommandTestBase
  {
    [Fact]
    public async Task Handle_ShouldPersistTruckRefillEntity()
    {
      var command = new CreateTruckRefillCommand
      {
        TruckId = 43,
        Amount = 10000,
        FuelCardNumber = 9696,
        FuelType = FuelType.GASOLINE,
        TimeStamp = new DateTime(2020, 1, 1, 4, 0, 0),
      };
      var handler = new CreateTruckRefillCommand.CreateTruckRefillCommandHandler(Context);
      var result = await handler.Handle(command, CancellationToken.None);
      var entity = Context.TruckRefills.Find(result);

      entity.Should().NotBeNull();
      entity.Amount.Should().Be(command.Amount);
      entity.FuelCardNumber.Should().Be(command.FuelCardNumber);
      entity.FuelType.Should().Be(command.FuelType);
      entity.TimeStamp.Should().Be(command.TimeStamp);
    }

    [Fact]
    public async Task Handle_NoSuchTruck()
    {
      var command = new CreateTruckRefillCommand
      {
        TruckId = -1,
        Amount = 10000,
        FuelCardNumber = 9696,
        FuelType = FuelType.GASOLINE,
        TimeStamp = new DateTime(2020, 1, 1, 4, 0, 0),
      };
      var handler = new CreateTruckRefillCommand.CreateTruckRefillCommandHandler(Context);


      await Assert.ThrowsAsync<NotFoundException>(
        async () => { await handler.Handle(command, CancellationToken.None); }
      );
    }

    [Fact]
    public async Task Handle_NoDailyState()
    {
      var command = new CreateTruckRefillCommand
      {
        TruckId = 43,
        Amount = 10000,
        FuelCardNumber = 9696,
        FuelType = FuelType.GASOLINE,
        TimeStamp = new DateTime(1, 1, 1, 4, 0, 0),
      };
      var handler = new CreateTruckRefillCommand.CreateTruckRefillCommandHandler(Context);


      await Assert.ThrowsAsync<NotFoundException>(
        async () => { await handler.Handle(command, CancellationToken.None); }
      );
    }
  }
}