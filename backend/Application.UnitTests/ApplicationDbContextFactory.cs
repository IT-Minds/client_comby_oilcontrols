using Application.Common.Interfaces;
using Domain.Entities;
using Domain.Enums;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Moq;
using System;
using System.Collections.Generic;

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
        new FuelTank { Id = 1, TankNumber = 443, FuelType = FuelType.GASOLINE, TankType = TankType.BUILDING, TankCapacity = 2000.5, MinimumFuelAmount = 150.5 },
        new FuelTank { Id = 2, TankNumber = 444, FuelType = FuelType.GASOLINE, TankType = TankType.BUILDING, TankCapacity = 2000.5, MinimumFuelAmount = 150.5 },
        new FuelTank { Id = 3, TankNumber = 445, FuelType = FuelType.GASOLINE, TankType = TankType.BUILDING, TankCapacity = 2000.5, MinimumFuelAmount = 150.5 },
        new FuelTank { Id = 4, TankNumber = 446, FuelType = FuelType.GASOLINE, TankType = TankType.BUILDING, TankCapacity = 2000.5, MinimumFuelAmount = 150.5 },
        new FuelTank { Id = 5, TankNumber = 447, FuelType = FuelType.GASOLINE, TankType = TankType.BUILDING, TankCapacity = 2000.5, MinimumFuelAmount = 150.5 },
        new FuelTank { Id = 6, /* TankNumber */ FuelType = FuelType.GASOLINE, TankType = TankType.BUILDING, TankCapacity = 1000, MinimumFuelAmount = 50 },
        new FuelTank { Id = 8, /* TankNumber */ FuelType = FuelType.GASOLINE, TankType = TankType.BUILDING, TankCapacity = 1000, MinimumFuelAmount = 50 },
        new FuelTank { Id = 7, /* TankNumber */ FuelType = FuelType.GASOLINE, TankType = TankType.BUILDING, TankCapacity = 1000, MinimumFuelAmount = 50 }
      );

      context.Locations.AddRange(
        new Location { Id = 1, FuelTankId = 1 /* RegionId */ },
        new Location { Id = 2, FuelTankId = 2 /* RegionId */ },
        new Location { Id = 3, FuelTankId = 3 /* RegionId */ },
        new Location { Id = 4, FuelTankId = 4 /* RegionId */ },
        new Location { Id = 5, FuelTankId = 5, RegionId = 5 },
        new Location { Id = 6, FuelTankId = 6, RegionId = 5 },
        new Location { Id = 7, FuelTankId = 7, RegionId = 5 },
        new Location { Id = 8, FuelTankId = 8, RegionId = 5 }
      );

      context.Locations.AddRange(
        new Location { Id = 1, FuelTankId = 1 },
        new Location { Id = 2, FuelTankId = 2 },
        new Location { Id = 3, FuelTankId = 3 },
        new Location { Id = 4, FuelTankId = 4 }
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
        new Coupon { Id = 9, CouponNumber = 19999, TruckId = 44, Created = DateTimeOffset.Now },
        new Coupon { Id = 10, CouponNumber = 20000, TruckId = 45, Created = DateTimeOffset.Now }
      );

      context.Refills.AddRange(
        new Refill { Id = 1, CouponId = 1, StartAmount = 10.5, EndAmount = 15.5, TankState = TankState.PARTIALLY_FILLED, ExpectedDeliveryDate = new DateTime(2020, 12, 12), LocationId = 1, Created = new DateTime(2020, 1, 1) },
        new Refill { Id = 2, CouponId = 2, StartAmount = 10.5, EndAmount = 15.5, TankState = TankState.PARTIALLY_FILLED, ExpectedDeliveryDate = new DateTime(2020, 12, 13), LocationId = 2, Created = new DateTime(2020, 1, 2) },
        new Refill { Id = 3, CouponId = 3, StartAmount = 10.5, EndAmount = 15.5, TankState = TankState.PARTIALLY_FILLED, ExpectedDeliveryDate = new DateTime(2020, 12, 14), LocationId = 3, Created = new DateTime(2020, 1, 3) },
        new Refill { Id = 4, CouponId = 4, StartAmount = 10.5, EndAmount = 15.5, TankState = TankState.PARTIALLY_FILLED, ExpectedDeliveryDate = new DateTime(2020, 12, 15), LocationId = 1, Created = new DateTime(2020, 1, 6) },
        new Refill { Id = 5, CouponId = 5, StartAmount = 10.5, EndAmount = 15.5, TankState = TankState.PARTIALLY_FILLED, ExpectedDeliveryDate = new DateTime(2020, 12, 16), LocationId = 1, Created = new DateTime(2020, 1, 8) },
        new Refill { Id = 7, CouponId = 6, StartAmount = 10.5, EndAmount = 15.5, TankState = TankState.PARTIALLY_FILLED, ExpectedDeliveryDate = new DateTime(2020, 12, 17), LocationId = 4, Created = new DateTime(2020, 1, 9) }
      );

      context.Regions.AddRange(
        new Region { Id = 1 },
        new Region { Id = 2 },
        new Region { Id = 3 },
        new Region { Id = 4 },
        new Region { Id = 5 }
      );

      context.FuelTanks.Add(new FuelTank { Id = 6, Type = TankType.BUILDING, TankCapacity = 1000, MinimumFuelAmount = 50 });
      context.Locations.Add(new Location { Id = 5, FuelTankId = 6, RegionId = 5 });
      context.RegionDailyTemps.AddRange(
        new RegionDailyTemp { Id = 1, RegionId = 5, Date = new DateTime(1990, 5, 1), Temperature = -10 },
        new RegionDailyTemp { Id = 2, RegionId = 5, Date = new DateTime(1990, 5, 2), Temperature = -11 },
        new RegionDailyTemp { Id = 3, RegionId = 5, Date = new DateTime(1990, 5, 3), Temperature = -12 },
        new RegionDailyTemp { Id = 4, RegionId = 5, Date = new DateTime(1990, 5, 4), Temperature = -13 },
        new RegionDailyTemp { Id = 5, RegionId = 5, Date = new DateTime(1990, 5, 5), Temperature = -14 },
        new RegionDailyTemp { Id = 6, RegionId = 5, Date = new DateTime(1990, 5, 6), Temperature = -15 },
        new RegionDailyTemp { Id = 7, RegionId = 5, Date = new DateTime(1990, 5, 7), Temperature = -16 },
        new RegionDailyTemp { Id = 8, RegionId = 5, Date = new DateTime(1990, 5, 8), Temperature = -17 },
        new RegionDailyTemp { Id = 9, RegionId = 5, Date = new DateTime(1990, 5, 9), Temperature = -18 }
      );
      context.Refills.AddRange(
        new Refill { Id = 8, CouponId = 8, Type = FuelType.GASOLINE, StartAmount = 100, EndAmount = 1000, TankState = TankState.FULL, ExpectedDeliveryDate = new DateTime(1990, 5, 1), ActualDeliveryDate = new DateTime(1990, 5, 1), LocationId = 5 },
        new Refill { Id = 9, CouponId = 9, Type = FuelType.GASOLINE, StartAmount = 200, EndAmount = 1000, TankState = TankState.FULL, ExpectedDeliveryDate = new DateTime(1990, 5, 1), ActualDeliveryDate = new DateTime(1990, 5, 9), LocationId = 5 }
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
        new Refill { Id = 8, CouponId = 8, StartAmount = 100, EndAmount = 1000, TankState = TankState.FULL, ExpectedDeliveryDate = new DateTime(1990, 5, 1), ActualDeliveryDate = new DateTime(1990, 5, 1), LocationId = 6 },
        new Refill { Id = 9, CouponId = 9, StartAmount = 200, EndAmount = 1000, TankState = TankState.FULL, ExpectedDeliveryDate = new DateTime(1990, 5, 1), ActualDeliveryDate = new DateTime(1990, 5, 9), LocationId = 6 },
        new Refill { Id = 10, CouponId = 9, StartAmount = 200, EndAmount = 1000, TankState = TankState.FULL, ExpectedDeliveryDate = new DateTime(2000, 5, 1), ActualDeliveryDate = new DateTime(2000, 5, 9), LocationId = 7 }
      );

      context.TruckDailyStates.AddRange(
        new TruckDailyState { Id = 1, TruckId = 43, Date = new DateTime(2020, 1, 1), MorningQuantity = 500, EveningQuantity = 1000 }
      );
      context.TruckRefills.AddRange(
        new TruckRefill { Id = 1, TimeStamp = new DateTime(2020, 1, 1, 8, 0, 0), FuelType = FuelType.GASOLINE, TruckDailyStateId = 1, Amount = 100, FuelCardNumber = 1 },
        new TruckRefill { Id = 2, TimeStamp = new DateTime(2020, 1, 1, 9, 0, 0), FuelType = FuelType.GASOLINE, TruckDailyStateId = 1, Amount = 200, FuelCardNumber = 1 },
        new TruckRefill { Id = 3, TimeStamp = new DateTime(2020, 1, 1, 18, 0, 0), FuelType = FuelType.GASOLINE, TruckDailyStateId = 1, Amount = 200, FuelCardNumber = 1 }
      );

      //START: Test data for the truck evening fuel amount entity extension.
      var refill100 = new Refill { Id = 100, CouponId = 100, StartAmount = 100, EndAmount = 300, TankState = TankState.FULL, ExpectedDeliveryDate = new DateTime(2020, 1, 1), ActualDeliveryDate = new DateTime(2020, 1, 1, 9, 0, 0), LocationId = 100 };
      var refill101 = new Refill { Id = 101, CouponId = 101, StartAmount = 200, EndAmount = 300, TankState = TankState.FULL, ExpectedDeliveryDate = new DateTime(2020, 1, 1), ActualDeliveryDate = new DateTime(2020, 1, 1, 10, 0, 0), LocationId = 100 };
      var refill102 = new Refill { Id = 102, CouponId = 102, StartAmount = 200, EndAmount = 300, TankState = TankState.FULL, ExpectedDeliveryDate = new DateTime(2020, 1, 1), ActualDeliveryDate = new DateTime(2020, 1, 2, 10, 0, 0), LocationId = 100 };

      context.FuelTanks.Add(
        new FuelTank { Id = 100, TankType = TankType.BUILDING, FuelType= FuelType.GASOLINE, TankNumber = 1001, TankCapacity = 300, MinimumFuelAmount = 0 }
      );
      context.Locations.Add(
        new Location { Id = 100, RegionId = 1, FuelTankId = 100, Address = "Very Nice 23.", Comments = "Very Nice 24." }
      );
      context.Routes.Add(
       new Route { Id = 100, Refills = new List<Refill> { refill100, refill101 } }
      );
      context.Trucks.Add(
        new Truck { Id = 100, RouteId = 100 }
      );
      context.Coupons.AddRange(
        new Coupon { Id = 100, CouponNumber = 100, TruckId = 100 },
        new Coupon { Id = 101, CouponNumber = 101, TruckId = 100 },
        new Coupon { Id = 102, CouponNumber = 102, TruckId = 100 },
        new Coupon { Id = 103, CouponNumber = 103, TruckId = 100 }
      );
      context.TruckDailyStates.AddRange(
        new TruckDailyState { Id = 100, Date = new DateTime(2020, 1, 1), MorningQuantity = 0, TruckId = 100 },
        new TruckDailyState { Id = 101, Date = new DateTime(2020, 1, 2), MorningQuantity = 0, TruckId = 100 },
        new TruckDailyState { Id = 102, Date = new DateTime(2020, 1, 3), MorningQuantity = 0, TruckId = 100 },
        new TruckDailyState { Id = 103, Date = new DateTime(2020, 1, 5), MorningQuantity = 1000, TruckId = 100 }
      );
      context.TruckRefills.AddRange(
        new TruckRefill { Id = 100, TimeStamp = new DateTime(2020, 1, 1, 8, 0, 0), Amount = 1000, FuelCardNumber = 1234567890, TruckDailyStateId = 100, FuelType = FuelType.GASOLINE },
        new TruckRefill { Id = 101, TimeStamp = new DateTime(2020, 1, 2, 8, 0, 0), Amount = 1000, FuelCardNumber = 1234567890, TruckDailyStateId = 101, FuelType = FuelType.GASOLINE },
        new TruckRefill { Id = 102, TimeStamp = new DateTime(2020, 1, 2, 15, 0, 0), Amount = 1000, FuelCardNumber = 1234567890, TruckDailyStateId = 101, FuelType = FuelType.OIL },
        new TruckRefill { Id = 103, TimeStamp = new DateTime(2020, 1, 3, 8, 0, 0), Amount = 1000, FuelCardNumber = 1234567890, TruckDailyStateId = 102, FuelType = FuelType.GASOLINE },
        new TruckRefill { Id = 104, TimeStamp = new DateTime(2020, 1, 3, 15, 0, 0), Amount = 1000, FuelCardNumber = 1234567890, TruckDailyStateId = 102, FuelType = FuelType.OIL },
        new TruckRefill { Id = 105, TimeStamp = new DateTime(2020, 1, 3, 17, 0, 0), Amount = 500, FuelCardNumber = 1234567890, TruckDailyStateId = 102, FuelType = FuelType.GASOLINE }
      );
      //END
      context.SaveChanges();
    }

    public static void Destroy(ApplicationDbContext context)
    {
      context.Database.EnsureDeleted();

      context.Dispose();
    }
  }
}
