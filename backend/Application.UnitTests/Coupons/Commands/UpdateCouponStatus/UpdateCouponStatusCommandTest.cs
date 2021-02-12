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

namespace Application.UnitTests.Coupons.Commands.AssignCoupons
{
  public class UpdateCouponStatusCommandTest : CommandTestBase
  {
    [Fact]
    public async Task Handle_ChangeCouponStatus()
    {
      var command = new UpdateCouponStatusCommand
      {
        Dto = new CouponStatusDto
        {
          CouponNumber = 19991
        }

      };

      var handler = new UpdateCouponStatusCommand.UpdateCouponstatusCommandHandler(Context, Mapper);

      var result = await handler.Handle(command, CancellationToken.None);

      var coupon = Context.Coupons.FirstOrDefault(x => x.CouponNumber == 19991);

      coupon.Should().NotBeNull();
      coupon.Status.Should().Be(CouponStatus.DESTROYED);
    }
  }
}
