using Application.Common.Exceptions;
using Application.Coupons.Commands.AssignCoupons;
using Application.Coupons.Commands.UpdateCouponStatus;
using Application.ExampleEntities.Commands.CreateExampleEntity;
using Domain.Enums;
using FluentAssertions;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace Application.UnitTests.Coupon.Commands.AssignCoupons
{
  public class UpdateCouponStatusCommandTest : CommandTestBase
  {
    [Fact]
    public async Task Handle_ChangeCouponStatus()
    {
      var command = new UpdateCouponStatusCommand
      {
        CouponNumber = 1004,
        TruckId = 3
      };

      var handler = new UpdateCouponStatusCommand.UpdateCouponstatusCommandHandler(Context);

      var result = await handler.Handle(command, CancellationToken.None);

      var coupon = Context.Coupons.FirstOrDefault(x => x.CouponNumber == 1004);

      coupon.Should().NotBeNull();
      coupon.Status.Should().Be(CouponStatus.DESTROYED);
    }

    [Fact]
    public async Task Handle_DontChangeStautsWrongTruckId()
    {
      var command = new UpdateCouponStatusCommand
      {
        CouponNumber = 1004,
        TruckId = 1
      };

      var handler = new UpdateCouponStatusCommand.UpdateCouponstatusCommandHandler(Context);

      await Assert.ThrowsAsync<NotFoundException>(
        async () => { await handler.Handle(command, CancellationToken.None); }
      );
    }
  }
}
