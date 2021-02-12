using FluentAssertions;
using System.Threading;
using System.Threading.Tasks;
using Xunit;
using System;
using Application.Refills.Commands.CompleteRefill;

namespace Application.UnitTests.Refills.Commands.CreateRefill
{
  public class CreateRefillCommandTest : CommandTestBase
  {
    [Fact(Skip = "Complete change of logic")]
    public async Task Handle_ShouldPersistRefillEntity()
    {
      var command = new CompleteRefillCommand
      {
        Id = 43,
        StartAmount = 100,
        EndAmount = 150,
        CouponNumber = 19991,
        ActualDeliveryDate = new DateTime(),
        TankState = Domain.Enums.TankState.FULL,
      };

      var handler = new CompleteRefillCommand.CompleteRefillCommandHandler(Context, null);

      var result = await handler.Handle(command, CancellationToken.None);

      var entity = Context.CompletedRefills.Find(result);

      entity.Should().NotBeNull();
      entity.StartAmount.Should().Be(command.StartAmount);
      entity.EndAmount.Should().Be(command.EndAmount);
      entity.Coupon.CouponNumber.Should().Be(command.CouponNumber);
      entity.ExpectedDeliveryDate.Should().Be(command.ActualDeliveryDate);
      // entity.Type.Should().Be(command.FuelType);
      entity.TankState.Should().Be(command.TankState);
    }

    [Fact(Skip = "Complete change of logic")]
    public async Task Handle_FailSinceSmallerCouponExists()
    {
      var command = new CompleteRefillCommand
      {
        Id = 43,
        StartAmount = 100,
        EndAmount = 150,
        CouponNumber = 19997,
        ActualDeliveryDate = new DateTime(),
        TankState = Domain.Enums.TankState.FULL
      };

      var handler = new CompleteRefillCommand.CompleteRefillCommandHandler(Context, null);

      await Assert.ThrowsAsync<ArgumentException>(
        async () => { await handler.Handle(command, CancellationToken.None); }
      );
    }

    [Fact(Skip = "Complete change of logic")]
    public async Task Handle_InvalidCouponNumber()
    {
      var command = new CompleteRefillCommand
      {
        Id = 43,
        StartAmount = 100,
        EndAmount = 150,
        CouponNumber = 0,
        ActualDeliveryDate = new DateTime(),
        TankState = Domain.Enums.TankState.FULL
      };

      var handler = new CompleteRefillCommand.CompleteRefillCommandHandler(Context, null);

      await Assert.ThrowsAsync<ArgumentException>(
        async () => { await handler.Handle(command, CancellationToken.None); }
      );
    }
  }
}
