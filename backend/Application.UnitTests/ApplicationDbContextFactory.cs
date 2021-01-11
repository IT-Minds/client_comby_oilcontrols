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

      context.Trucks.AddRange(
        new Truck { Id = 43 },
        new Truck { Id = 44 }
      );

      context.Locations.AddRange(
        new Location { Id = 1, Type = TankType.BUILDING, TankNumber = 443 },
        new Location { Id = 2, Type = TankType.BUILDING, TankNumber = 444 },
        new Location { Id = 3, Type = TankType.BUILDING, TankNumber = 445 },
        new Location { Id = 4, Type = TankType.BUILDING, TankNumber = 446 }
      );

      context.Coupons.AddRange(
        new Coupon { Id = 1, CouponNumber = 19991, TruckId = 1 },
        new Coupon { Id = 2, CouponNumber = 19992, TruckId = 1 },
        new Coupon { Id = 3, CouponNumber = 19993, TruckId = 1 },
        new Coupon { Id = 4, CouponNumber = 19994, TruckId = 1 },
        new Coupon { Id = 5, CouponNumber = 19995, TruckId = 1 },
        new Coupon { Id = 6, CouponNumber = 19996, TruckId = 1 },
        new Coupon { Id = 7, CouponNumber = 19997, TruckId = 3 },
        new Coupon { Id = 8, CouponNumber = 19998, TruckId = 4 },
        new Coupon { Id = 9, CouponNumber = 19999, TruckId = 4 }

      );

      context.Refills.AddRange(
        new Refill { Id = 1, CouponId = 1, Type = FuelType.GASOLINE, StartAmount = 10.5, EndAmount = 15.5, TankState = TankState.PARTIALLY_FILLED, Date = new DateTime(2020, 12, 12), LocationId = 1 },
        new Refill { Id = 2, CouponId = 2, Type = FuelType.GASOLINE, StartAmount = 10.5, EndAmount = 15.5, TankState = TankState.PARTIALLY_FILLED, Date = new DateTime(2020, 12, 13), LocationId = 2 },
        new Refill { Id = 3, CouponId = 3, Type = FuelType.GASOLINE, StartAmount = 10.5, EndAmount = 15.5, TankState = TankState.PARTIALLY_FILLED, Date = new DateTime(2020, 12, 14), LocationId = 3 },
        new Refill { Id = 4, CouponId = 4, Type = FuelType.GASOLINE, StartAmount = 10.5, EndAmount = 15.5, TankState = TankState.PARTIALLY_FILLED, Date = new DateTime(2020, 12, 15), LocationId = 1 },
        new Refill { Id = 5, CouponId = 5, Type = FuelType.GASOLINE, StartAmount = 10.5, EndAmount = 15.5, TankState = TankState.PARTIALLY_FILLED, Date = new DateTime(2020, 12, 16), LocationId = 1 },
        new Refill { Id = 7, CouponId = 5, Type = FuelType.GASOLINE, StartAmount = 10.5, EndAmount = 15.5, TankState = TankState.PARTIALLY_FILLED, Date = new DateTime(2020, 12, 17), LocationId = 4 }
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
