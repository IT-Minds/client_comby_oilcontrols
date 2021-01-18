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

      var route1 = new Route { Id = 1 };
      var route2 = new Route { Id = 2 };

      context.Trucks.AddRange(
        new Truck { Id = 43, Route = route1 },
        new Truck { Id = 44, Route = route2 }
      );

      context.FuelTanks.AddRange(
        new FuelTank { Id = 1, TankNumber = 443, Type = TankType.BUILDING, TankCapacity = 2000.5, MinimumFuelAmount = 150.5 },
        new FuelTank { Id = 2, TankNumber = 444, Type = TankType.BUILDING, TankCapacity = 2000.5, MinimumFuelAmount = 150.5 },
        new FuelTank { Id = 3, TankNumber = 445, Type = TankType.BUILDING, TankCapacity = 2000.5, MinimumFuelAmount = 150.5 },
        new FuelTank { Id = 4, TankNumber = 446, Type = TankType.BUILDING, TankCapacity = 2000.5, MinimumFuelAmount = 150.5 },
        new FuelTank { Id = 5, TankNumber = 447, Type = TankType.BUILDING, TankCapacity = 2000.5, MinimumFuelAmount = 150.5 }
      );

      context.Locations.AddRange(
        new Location { Id = 1, FuelTankId = 1 },
        new Location { Id = 2, FuelTankId = 2 },
        new Location { Id = 3, FuelTankId = 3 },
        new Location { Id = 4, FuelTankId = 4 },
        new Location { Id = 5, FuelTankId = 5 }
      );

      context.Coupons.AddRange(
        new Coupon { Id = 1, CouponNumber = 19991, TruckId = 43, Created = DateTimeOffset.Now },
        new Coupon { Id = 2, CouponNumber = 19992, TruckId = 43, Created = DateTimeOffset.Now },
        new Coupon { Id = 3, CouponNumber = 19993, TruckId = 43, Created = DateTimeOffset.Now },
        new Coupon { Id = 4, CouponNumber = 19994, TruckId = 43, Created = DateTimeOffset.Now },
        new Coupon { Id = 5, CouponNumber = 19995, TruckId = 43, Created = DateTimeOffset.Now },
        new Coupon { Id = 6, CouponNumber = 19996, TruckId = 43, Created = DateTimeOffset.Now },
        new Coupon { Id = 7, CouponNumber = 19997, TruckId = 43, Created = DateTimeOffset.Now },
        new Coupon { Id = 8, CouponNumber = 19998, TruckId = 44, Created = DateTimeOffset.Now },
        new Coupon { Id = 9, CouponNumber = 19999, TruckId = 44, Created = DateTimeOffset.Now }
      );

      context.Refills.AddRange(
        new Refill { Id = 1, CouponId = 1, Type = FuelType.GASOLINE, StartAmount = 10.5, EndAmount = 15.5, TankState = TankState.PARTIALLY_FILLED, ExpectedDeliveryDate = new DateTime(2020, 12, 12), LocationId = 1, Created = new DateTime(2020, 1, 1) },
        new Refill { Id = 2, CouponId = 2, Type = FuelType.GASOLINE, StartAmount = 10.5, EndAmount = 15.5, TankState = TankState.PARTIALLY_FILLED, ExpectedDeliveryDate = new DateTime(2020, 12, 13), LocationId = 2, Created = new DateTime(2020, 1, 2) },
        new Refill { Id = 3, CouponId = 3, Type = FuelType.GASOLINE, StartAmount = 10.5, EndAmount = 15.5, TankState = TankState.PARTIALLY_FILLED, ExpectedDeliveryDate = new DateTime(2020, 12, 14), LocationId = 3, Created = new DateTime(2020, 1, 3) },
        new Refill { Id = 4, CouponId = 4, Type = FuelType.GASOLINE, StartAmount = 10.5, EndAmount = 15.5, TankState = TankState.PARTIALLY_FILLED, ExpectedDeliveryDate = new DateTime(2020, 12, 15), LocationId = 1, Created = new DateTime(2020, 1, 6) },
        new Refill { Id = 5, CouponId = 5, Type = FuelType.GASOLINE, StartAmount = 10.5, EndAmount = 15.5, TankState = TankState.PARTIALLY_FILLED, ExpectedDeliveryDate = new DateTime(2020, 12, 16), LocationId = 1, Created = new DateTime(2020, 1, 8) },
        new Refill { Id = 7, CouponId = 6, Type = FuelType.GASOLINE, StartAmount = 10.5, EndAmount = 15.5, TankState = TankState.PARTIALLY_FILLED, ExpectedDeliveryDate = new DateTime(2020, 12, 17), LocationId = 4, Created = new DateTime(2020, 1, 9) }
      );

      context.Regions.AddRange(
        new Region { Id = 1 },
        new Region { Id = 2 },
        new Region { Id = 3 },
        new Region { Id = 4 },
        new Region { Id = 5 }
      );

      context.RegionDailyTemps.AddRange(
        new RegionDailyTemp { Id = 1, RegionId = 1, Date = new DateTime(1990, 1, 1), Temperature = 5 },
        new RegionDailyTemp { Id = 2, RegionId = 1, Date = new DateTime(1991, 1, 1), Temperature = 10 },
        new RegionDailyTemp { Id = 3, RegionId = 1, Date = new DateTime(1992, 1, 1), Temperature = 2 },
        new RegionDailyTemp { Id = 4, RegionId = 1, Date = new DateTime(1993, 1, 1), Temperature = 3 },
        new RegionDailyTemp { Id = 5, RegionId = 1, Date = new DateTime(1994, 1, 1), Temperature = -10 },
        new RegionDailyTemp { Id = 6, RegionId = 1, Date = new DateTime(1995, 1, 1), Temperature = 1 },
        new RegionDailyTemp { Id = 7, RegionId = 1, Date = new DateTime(1996, 1, 1), Temperature = -30 },
        new RegionDailyTemp { Id = 8, RegionId = 1, Date = new DateTime(1997, 1, 1), Temperature = 20 },
        new RegionDailyTemp { Id = 9, RegionId = 1, Date = new DateTime(1998, 1, 1), Temperature = -15 }
      );

      context.Streets.AddRange(
        new Street { Id = 1, Name = "A_Street", RegionId = 1 },
        new Street { Id = 2, Name = "Aa_Street", RegionId = 1 },
        new Street { Id = 3, Name = "Aaa_Street", RegionId = 1 },
        new Street { Id = 4, Name = "b_Street", RegionId = 1 },
        new Street { Id = 5, Name = "ba_Street", RegionId = 2 },
        new Street { Id = 6, Name = "ca_Street", RegionId = 2 },
        new Street { Id = 7, Name = "cb_Street", RegionId = 3 },
        new Street { Id = 8, Name = "re_Street", RegionId = 3 },
        new Street { Id = 9, Name = "st_Street", RegionId = 5 }
      );

      context.FuelTanks.Add(new FuelTank { Id = 6, Type = TankType.BUILDING, TankCapacity = 1000, MinimumFuelAmount = 50 });

      context.Locations.Add(new Location { Id = 6, FuelTankId = 6, RegionId = 5 });

      context.RegionDailyTemps.AddRange(
        new RegionDailyTemp { Id = 10, RegionId = 5, Date = new DateTime(1990, 5, 1), Temperature = -10 },
        new RegionDailyTemp { Id = 11, RegionId = 5, Date = new DateTime(1990, 5, 2), Temperature = -11 },
        new RegionDailyTemp { Id = 12, RegionId = 5, Date = new DateTime(1990, 5, 3), Temperature = -12 },
        new RegionDailyTemp { Id = 13, RegionId = 5, Date = new DateTime(1990, 5, 4), Temperature = -13 },
        new RegionDailyTemp { Id = 14, RegionId = 5, Date = new DateTime(1990, 5, 5), Temperature = -14 },
        new RegionDailyTemp { Id = 15, RegionId = 5, Date = new DateTime(1990, 5, 6), Temperature = -15 },
        new RegionDailyTemp { Id = 16, RegionId = 5, Date = new DateTime(1990, 5, 7), Temperature = -16 },
        new RegionDailyTemp { Id = 17, RegionId = 5, Date = new DateTime(1990, 5, 8), Temperature = -17 },
        new RegionDailyTemp { Id = 18, RegionId = 5, Date = new DateTime(1990, 5, 9), Temperature = -18 }
      );

      context.Refills.AddRange(
        new Refill { Id = 8, CouponId = 8, Type = FuelType.GASOLINE, StartAmount = 100, EndAmount = 1000, TankState = TankState.FULL, ExpectedDeliveryDate = new DateTime(1990, 5, 1), ActualDeliveryDate = new DateTime(1990, 5, 1), LocationId = 5 },
        new Refill { Id = 9, CouponId = 9, Type = FuelType.GASOLINE, StartAmount = 200, EndAmount = 1000, TankState = TankState.FULL, ExpectedDeliveryDate = new DateTime(1990, 5, 1), ActualDeliveryDate = new DateTime(1990, 5, 9), LocationId = 5 }
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
