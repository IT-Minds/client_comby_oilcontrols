using Application.Common.Interfaces;
using Domain.Entities;
using Domain.Enums;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Moq;
using System;

namespace Application.UnitTests
{
  public static class ApplicationDbContextFactory
  {
    public static ApplicationDbContext Create()
    {
      var options = new DbContextOptionsBuilder<ApplicationDbContext>()
          .ConfigureWarnings(x => x.Ignore(InMemoryEventId.TransactionIgnoredWarning))
          .UseInMemoryDatabase(Guid.NewGuid().ToString())
          .Options;

      var dateTimeMock = new Mock<IDateTimeOffsetService>();
      dateTimeMock.Setup(m => m.Now)
          .Returns(new DateTimeOffset(3001, 1, 1, 1, 1, 1, TimeSpan.Zero));

      var currentUserServiceMock = new Mock<ICurrentUserService>();
      currentUserServiceMock.Setup(m => m.UserId)
          .Returns("00000000-0000-0000-0000-000000000000");

      var context = new ApplicationDbContext(options, currentUserServiceMock.Object, dateTimeMock.Object);

      context.Database.EnsureCreated();

      SeedSampleData(context);

      return context;
    }

    public static void SeedSampleData(ApplicationDbContext context)
    {
      context.ExampleEntityLists.AddRange(
          new ExampleEntityList() { Id = 1, Name = "Test" }
      );

      context.ExampleEntities.AddRange(
          new ExampleEntity { Id = 1, ExampleEntityListId = 1, Name = "Bread", ExampleEnum = ExampleEnum.A },
          new ExampleEntity { Id = 2, ExampleEntityListId = 1, Name = "Butter", ExampleEnum = ExampleEnum.A },
          new ExampleEntity { Id = 3, ExampleEntityListId = 1, Name = "Milk", ExampleEnum = ExampleEnum.B },
          new ExampleEntity { Id = 4, ExampleEntityListId = null, Name = "Sugar", ExampleEnum = ExampleEnum.C },
          new ExampleEntity { Id = 5, ExampleEntityListId = null, Name = "Coffee", ExampleEnum = ExampleEnum.D }
      );

      var truck1 = new Truck { Id = 1 };
      var truck2 = new Truck { Id = 2 };
      var truck3 = new Truck { Id = 3 };
      var truck4 = new Truck { Id = 4 };

      context.Trucks.AddRange(
        truck1,
        truck2,
        truck3,
        truck4
      );

      context.Locations.Add(
        new Location { Id = 1, TankNumber = 80, Type = Domain.Enums.TankType.BUILDING }
      );

      context.Coupons.AddRange(
        new Coupon { Id = 1, Status = Domain.Enums.CouponStatus.AVAILABLE, Truck = truck1},
        new Coupon { Id = 2, Status = Domain.Enums.CouponStatus.AVAILABLE, Truck = truck2},
        new Coupon { Id = 3, Status = Domain.Enums.CouponStatus.AVAILABLE, Truck = truck2},
        new Coupon { Id = 4, Status = Domain.Enums.CouponStatus.AVAILABLE, Truck = truck3}
      );
      context.SaveChanges();
    }

    public static void Destroy(ApplicationDbContext context)
    {
      context.Database.EnsureDeleted();

      context.Dispose();
    }
  }
}
