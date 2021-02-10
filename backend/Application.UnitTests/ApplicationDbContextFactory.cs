using Application.Common.Interfaces;
using Domain.Entities;
using Domain.Entities.Refills;
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

      var driver1 = new User { Username = "Driver1", Password = "Password" };
      var driver2 = new User { Username = "Driver2", Password = "Password" };
      context.Users.AddRange(
        driver1,
        driver2
      );

      context.Trucks.AddRange(
        new Truck { Driver = driver1, Id = 43, TruckIdentifier = "Truck1" },
        new Truck { Driver = driver2, Id = 44, TruckIdentifier = "Truck2" }
      );

      context.FuelTanks.AddRange(
        new FuelTank { Id = 1, TankNumber = 443, FuelType = FuelType.GASOLINE, TankType = TankType.BUILDING, TankCapacity = 2000.5, MinimumFuelAmount = 150.5 },
        new FuelTank { Id = 2, TankNumber = 444, FuelType = FuelType.GASOLINE, TankType = TankType.BUILDING, TankCapacity = 2000.5, MinimumFuelAmount = 150.5 },
        new FuelTank { Id = 3, TankNumber = 445, FuelType = FuelType.GASOLINE, TankType = TankType.BUILDING, TankCapacity = 2000.5, MinimumFuelAmount = 150.5 },
        new FuelTank { Id = 4, TankNumber = 446, FuelType = FuelType.GASOLINE, TankType = TankType.BUILDING, TankCapacity = 2000.5, MinimumFuelAmount = 150.5 },
        new FuelTank { Id = 5, TankNumber = 447, FuelType = FuelType.GASOLINE, TankType = TankType.BUILDING, TankCapacity = 2000.5, MinimumFuelAmount = 150.5 },
        new FuelTank { Id = 6, /* TankNumber */ FuelType = FuelType.GASOLINE, TankType = TankType.BUILDING, TankCapacity = 1000, MinimumFuelAmount = 50 },
        new FuelTank { Id = 8, /* TankNumber */ FuelType = FuelType.GASOLINE, TankType = TankType.BUILDING, TankCapacity = 1000, MinimumFuelAmount = 50 },
        new FuelTank { Id = 7, /* TankNumber */ FuelType = FuelType.GASOLINE, TankType = TankType.BUILDING, TankCapacity = 1000, MinimumFuelAmount = 50 },
        new FuelTank { Id = 100, TankType = TankType.BUILDING, FuelType = FuelType.GASOLINE, TankNumber = 1001, TankCapacity = 300, MinimumFuelAmount = 0 }
      );

      context.Locations.AddRange(
        new Location { Id = 1, FuelTankId = 1 /* RegionId */ },
        new Location { Id = 2, FuelTankId = 2, RegionId = 5, Schedule = RefillSchedule.AUTOMATIC, EstimateFuelConsumption = 10 },
        new Location { Id = 3, FuelTankId = 3 /* RegionId */ },
        new Location { Id = 4, FuelTankId = 4 /* RegionId */ },
        new Location { Id = 5, FuelTankId = 5, RegionId = 5, Schedule = RefillSchedule.AUTOMATIC, EstimateFuelConsumption = 10 },
        new Location { Id = 6, FuelTankId = 6, RegionId = 5, Schedule = RefillSchedule.INTERVAL, DaysBetweenRefills = 7 },
        new Location { Id = 7, FuelTankId = 7, RegionId = 5, Schedule = RefillSchedule.MANUAL },
        new Location { Id = 8, FuelTankId = 8, RegionId = 5, Schedule = RefillSchedule.AUTOMATIC }
      );

      context.Locations.Add(
        new Location { Id = 100, RegionId = 1, FuelTankId = 100, Address = "Very Nice 23.", Comments = "Very Nice 24." }
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

      context.CompletedRefills.AddRange(
        new CompletedRefill { Id = 1, CouponId = 1, StartAmount = 10.5, EndAmount = 15.5, TankState = TankState.PARTIALLY_FILLED, ExpectedDeliveryDate = new DateTime(2020, 12, 12), LocationId = 1, Created = new DateTime(2020, 1, 1) },
        new CompletedRefill { Id = 2, CouponId = 2, StartAmount = 10.5, EndAmount = 15.5, TankState = TankState.PARTIALLY_FILLED, ExpectedDeliveryDate = new DateTime(2020, 12, 13), LocationId = 2, Created = new DateTime(2020, 1, 2) },
        new CompletedRefill { Id = 3, CouponId = 3, StartAmount = 10.5, EndAmount = 15.5, TankState = TankState.PARTIALLY_FILLED, ExpectedDeliveryDate = new DateTime(2020, 12, 14), LocationId = 3, Created = new DateTime(2020, 1, 3) },
        new CompletedRefill { Id = 4, CouponId = 4, StartAmount = 10.5, EndAmount = 15.5, TankState = TankState.PARTIALLY_FILLED, ExpectedDeliveryDate = new DateTime(2020, 12, 15), LocationId = 1, Created = new DateTime(2020, 1, 6) },
        new CompletedRefill { Id = 5, CouponId = 5, StartAmount = 10.5, EndAmount = 15.5, TankState = TankState.PARTIALLY_FILLED, ExpectedDeliveryDate = new DateTime(2020, 12, 16), LocationId = 1, Created = new DateTime(2020, 1, 8) },
        new CompletedRefill { Id = 7, CouponId = 6, StartAmount = 10.5, EndAmount = 15.5, TankState = TankState.PARTIALLY_FILLED, ExpectedDeliveryDate = new DateTime(2020, 12, 17), LocationId = 4, Created = new DateTime(2020, 1, 9) },
        new CompletedRefill { Id = 8, CouponId = 8, StartAmount = 100, EndAmount = 1000, TankState = TankState.FULL, ExpectedDeliveryDate = new DateTime(1990, 5, 1), ActualDeliveryDate = new DateTime(1990, 5, 1), LocationId = 5 },
        new CompletedRefill { Id = 9, CouponId = 9, StartAmount = 200, EndAmount = 1000, TankState = TankState.FULL, ExpectedDeliveryDate = new DateTime(1990, 5, 1), ActualDeliveryDate = new DateTime(1990, 5, 5), LocationId = 5 },
        new CompletedRefill { Id = 11, CouponId = 11, StartAmount = 200, EndAmount = 1000, TankState = TankState.FULL, ExpectedDeliveryDate = new DateTime(1990, 5, 9), ActualDeliveryDate = new DateTime(1990, 5, 9), LocationId = 5 },
        new CompletedRefill { Id = 12, CouponId = 12, StartAmount = 200, EndAmount = 1000, TankState = TankState.FULL, ExpectedDeliveryDate = new DateTime(2000, 5, 1), ActualDeliveryDate = new DateTime(2000, 5, 9), LocationId = 7 },
        new CompletedRefill { Id = 13, CouponId = 13, StartAmount = 200, EndAmount = 1000, TankState = TankState.FULL, ExpectedDeliveryDate = new DateTime(2000, 5, 1), ActualDeliveryDate = new DateTime(2000, 5, 9), LocationId = 7 },
        new CompletedRefill { Id = 10, CouponId = 10, StartAmount = 200, EndAmount = 1000, TankState = TankState.FULL, ExpectedDeliveryDate = new DateTime(2000, 5, 1), ActualDeliveryDate = new DateTime(2000, 5, 9), LocationId = 7 }
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


      context.TruckDailyStates.AddRange(
        new TruckDailyState { Id = 1, TruckId = 43, Date = new DateTime(2020, 1, 1), MorningQuantity = 500, EveningQuantity = 1000 }
      );
      context.TruckRefills.AddRange(
        new TruckRefill { Id = 1, TimeStamp = new DateTime(2020, 1, 1, 8, 0, 0), FuelType = FuelType.GASOLINE, TruckDailyStateId = 1, Amount = 100, FuelCardNumber = 1 },
        new TruckRefill { Id = 2, TimeStamp = new DateTime(2020, 1, 1, 9, 0, 0), FuelType = FuelType.GASOLINE, TruckDailyStateId = 1, Amount = 200, FuelCardNumber = 1 },
        new TruckRefill { Id = 3, TimeStamp = new DateTime(2020, 1, 1, 18, 0, 0), FuelType = FuelType.GASOLINE, TruckDailyStateId = 1, Amount = 200, FuelCardNumber = 1 }
      );

      //START: Test data for the truck evening fuel amount entity extension.
      var refill100 = new CompletedRefill { Id = 100, CouponId = 100, StartAmount = 100, EndAmount = 300, TankState = TankState.FULL, ExpectedDeliveryDate = new DateTime(2020, 1, 1), ActualDeliveryDate = new DateTime(2020, 1, 1, 9, 0, 0), LocationId = 100 };
      var refill101 = new CompletedRefill { Id = 101, CouponId = 101, StartAmount = 200, EndAmount = 300, TankState = TankState.FULL, ExpectedDeliveryDate = new DateTime(2020, 1, 1), ActualDeliveryDate = new DateTime(2020, 1, 1, 10, 0, 0), LocationId = 100 };
      var refill102 = new CompletedRefill { Id = 102, CouponId = 102, StartAmount = 200, EndAmount = 300, TankState = TankState.FULL, ExpectedDeliveryDate = new DateTime(2020, 1, 1), ActualDeliveryDate = new DateTime(2020, 1, 2, 10, 0, 0), LocationId = 100 };

      var driver3 = new User { Username = "Driver3", Password = "Password" };
      context.Users.AddRange(
        driver3
      );

      context.Trucks.Add(
        new Truck { Driver = driver3, Id = 100, TruckIdentifier = "Truck3" }
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

      //START: Test data predict yearly fuel consumption
      context.Regions.AddRange(
        new Region { Id = 300 },
        new Region { Id = 301 }
      );
      context.FuelTanks.AddRange(
        new FuelTank { Id = 300, TankNumber = 300, FuelType = FuelType.GASOLINE, TankType = TankType.BUILDING, TankCapacity = 1000, MinimumFuelAmount = 100 },
        new FuelTank { Id = 301, TankNumber = 301, FuelType = FuelType.GASOLINE, TankType = TankType.BUILDING, TankCapacity = 1000, MinimumFuelAmount = 100 },
        new FuelTank { Id = 302, TankNumber = 302, FuelType = FuelType.GASOLINE, TankType = TankType.BUILDING, TankCapacity = 1000, MinimumFuelAmount = 100 }
      );
      context.Locations.AddRange(
        new Location { Id = 300, RegionId = 300, FuelTankId = 300, Address = "Address region 300.", Comments = "Location 300.", EstimateFuelConsumption = 100 },
        new Location { Id = 301, RegionId = 300, FuelTankId = 301, Address = "Address region 300.", Comments = "Location 301.", EstimateFuelConsumption = 100 },
        new Location { Id = 302, RegionId = 301, FuelTankId = 302, Address = "Address region 300.", Comments = "Location 302.", EstimateFuelConsumption = 100 }
      );

      context.CompletedRefills.AddRange(
        new CompletedRefill { Id = 300, CouponId = 300, StartAmount = 100, EndAmount = 1000, TankState = TankState.FULL, ExpectedDeliveryDate = new DateTime(1950, 5, 1), ActualDeliveryDate = new DateTime(1950, 5, 1), LocationId = 301 },
        new CompletedRefill { Id = 301, CouponId = 301, StartAmount = 100, EndAmount = 1000, TankState = TankState.FULL, ExpectedDeliveryDate = new DateTime(1950, 5, 10), ActualDeliveryDate = new DateTime(1950, 5, 10), LocationId = 301 },
        new CompletedRefill { Id = 302, CouponId = 302, StartAmount = 100, EndAmount = 1000, TankState = TankState.FULL, ExpectedDeliveryDate = new DateTime(1950, 5, 10), ActualDeliveryDate = new DateTime(1950, 5, 20), LocationId = 301 }
      );

      DateTime period = new DateTime(1944, 1, 1);
      int id = 1950;
      while (period.Year < 1951)
      {
        context.RegionDailyTemps.Add(
          new RegionDailyTemp { Id = id++, RegionId = 300, Date = period, Temperature = -5 }
        );
        period = period.AddDays(1);
      }
      //Start: Testdata day reaching minimum fuel levels prediction
      context.Regions.Add(new Region { Id = 200 });

      context.RegionDailyTemps.AddRange(
        new RegionDailyTemp { Id = 210, RegionId = 200, Date = new DateTime(1990, 5, 1), Temperature = -10 },
        new RegionDailyTemp { Id = 211, RegionId = 200, Date = new DateTime(1990, 5, 2), Temperature = -11 },
        new RegionDailyTemp { Id = 212, RegionId = 200, Date = new DateTime(1990, 5, 3), Temperature = -12 },
        new RegionDailyTemp { Id = 213, RegionId = 200, Date = new DateTime(1990, 5, 4), Temperature = -13 },
        new RegionDailyTemp { Id = 214, RegionId = 200, Date = new DateTime(1990, 5, 5), Temperature = -14 },
        new RegionDailyTemp { Id = 215, RegionId = 200, Date = new DateTime(1990, 5, 6), Temperature = -15 },
        new RegionDailyTemp { Id = 216, RegionId = 200, Date = new DateTime(1990, 5, 7), Temperature = -16 },
        new RegionDailyTemp { Id = 217, RegionId = 200, Date = new DateTime(1990, 5, 8), Temperature = -17 },
        new RegionDailyTemp { Id = 218, RegionId = 200, Date = new DateTime(1990, 5, 9), Temperature = -18 }
      );
      context.RegionDailyTemps.AddRange(
        new RegionDailyTemp { Id = 219, RegionId = 200, Date = new DateTime(1989, 5, 1), Temperature = -10 },
        new RegionDailyTemp { Id = 220, RegionId = 200, Date = new DateTime(1989, 5, 2), Temperature = -11 },
        new RegionDailyTemp { Id = 221, RegionId = 200, Date = new DateTime(1989, 5, 3), Temperature = -12 },
        new RegionDailyTemp { Id = 222, RegionId = 200, Date = new DateTime(1989, 5, 4), Temperature = -13 },
        new RegionDailyTemp { Id = 223, RegionId = 200, Date = new DateTime(1989, 5, 5), Temperature = -14 },
        new RegionDailyTemp { Id = 224, RegionId = 200, Date = new DateTime(1989, 5, 6), Temperature = -15 },
        new RegionDailyTemp { Id = 225, RegionId = 200, Date = new DateTime(1989, 5, 7), Temperature = -16 },
        new RegionDailyTemp { Id = 226, RegionId = 200, Date = new DateTime(1989, 5, 8), Temperature = -17 },
        new RegionDailyTemp { Id = 227, RegionId = 200, Date = new DateTime(1989, 5, 9), Temperature = -18 }
      );

      context.FuelTanks.AddRange(
        new FuelTank { Id = 200, TankNumber = 200, FuelType = FuelType.GASOLINE, TankType = TankType.BUILDING, TankCapacity = 1000, MinimumFuelAmount = 100 },
        new FuelTank { Id = 201, TankNumber = 201, FuelType = FuelType.GASOLINE, TankType = TankType.BUILDING, TankCapacity = 1000, MinimumFuelAmount = 100 },
        new FuelTank { Id = 202, TankNumber = 202, FuelType = FuelType.GASOLINE, TankType = TankType.BUILDING, TankCapacity = 1000, MinimumFuelAmount = 100 }
      );

      context.Locations.AddRange(
        new Location { Id = 200, RegionId = 200, FuelTankId = 200, Address = "Address region 200.", Comments = "Location 200.", EstimateFuelConsumption = 100 },
        new Location { Id = 201, RegionId = 200, FuelTankId = 201, Address = "Address region 200.", Comments = "Location 201.", EstimateFuelConsumption = 100 },
        new Location { Id = 202, RegionId = 200, FuelTankId = 202, Address = "Address region 200.", Comments = "Location 201.", EstimateFuelConsumption = 100 }
      );

      context.CompletedRefills.AddRange(
        new CompletedRefill { Id = 200, CouponId = 200, StartAmount = 100, EndAmount = 200, TankState = TankState.PARTIALLY_FILLED, ExpectedDeliveryDate = new DateTime(1990, 5, 1), ActualDeliveryDate = new DateTime(1990, 5, 1), LocationId = 200, Created = new DateTime(1990, 5, 1) },
        new CompletedRefill { Id = 201, CouponId = 201, StartAmount = 100, EndAmount = 1000, TankState = TankState.FULL, ExpectedDeliveryDate = new DateTime(1990, 5, 1), ActualDeliveryDate = new DateTime(1990, 5, 1), LocationId = 201, Created = new DateTime(1990, 5, 1) },
        new CompletedRefill { Id = 202, CouponId = 202, StartAmount = 200, EndAmount = 1000, TankState = TankState.FULL, ExpectedDeliveryDate = new DateTime(1990, 5, 4), ActualDeliveryDate = new DateTime(1990, 5, 4), LocationId = 201, Created = new DateTime(1990, 5, 4) }
      );

      //END
      //START: Location history test data.
      context.LocationHistories.AddRange(
        new LocationHistory { Address = "old address 1", Comments = "old comment 1", LocationId = 1, RegionId = 1, Schedule = RefillSchedule.MANUAL, LastModified = new DateTimeOffset(new DateTime(1990, 1, 1)), Created = new DateTimeOffset(new DateTime(1990, 1, 1)) },
        new LocationHistory { Address = "old address 2", Comments = "old comment 2", LocationId = 1, RegionId = 1, Schedule = RefillSchedule.MANUAL, LastModified = new DateTimeOffset(new DateTime(1990, 1, 2)), Created = new DateTimeOffset(new DateTime(1990, 1, 2)) },
        new LocationHistory { Address = "old address 3", Comments = "old comment 3", LocationId = 1, RegionId = 1, Schedule = RefillSchedule.MANUAL, LastModified = new DateTimeOffset(new DateTime(1990, 1, 3)), Created = new DateTimeOffset(new DateTime(1990, 1, 3)) }
      );
      //END
      //START: Data to test the commands to remove/update/add debtors to location.
      context.Regions.AddRange(
        new Region { Id = 400 },
        new Region { Id = 500 }
      );
      context.FuelTanks.AddRange(
        new FuelTank { Id = 400, TankNumber = 400, FuelType = FuelType.GASOLINE, TankType = TankType.BUILDING, TankCapacity = 1000, MinimumFuelAmount = 100 },
        new FuelTank { Id = 401, TankNumber = 401, FuelType = FuelType.GASOLINE, TankType = TankType.BUILDING, TankCapacity = 1000, MinimumFuelAmount = 100 },
        new FuelTank { Id = 500, TankNumber = 500, FuelType = FuelType.GASOLINE, TankType = TankType.BUILDING, TankCapacity = 1000, MinimumFuelAmount = 100 },
        new FuelTank { Id = 501, TankNumber = 501, FuelType = FuelType.GASOLINE, TankType = TankType.BUILDING, TankCapacity = 1000, MinimumFuelAmount = 100 }
      );
      context.Debtors.AddRange(
        new Debtor { Id = 1 },
        new Debtor { Id = 2 },
        new Debtor { Id = 500, CouponRequired = false },
        new Debtor { Id = 501, CouponRequired = false }
      );
      context.Locations.AddRange(
        new Location { Id = 400, RegionId = 400, FuelTankId = 400, Address = "Address region 400.", Comments = "Location 400.", EstimateFuelConsumption = 100 },
        new Location { Id = 401, RegionId = 400, FuelTankId = 401, Address = "Address region 400.", Comments = "Location 401.", EstimateFuelConsumption = 100 },
        new Location { Id = 500, RegionId = 500, FuelTankId = 500, Address = "Address region 500.", Comments = "Location 500.", EstimateFuelConsumption = 100 },
        new Location { Id = 501, RegionId = 500, FuelTankId = 501, Address = "Address region 500.", Comments = "Location 501.", EstimateFuelConsumption = 100 }
      );
      context.LocationDebtors.AddRange(
        new LocationDebtor { Id=100,LocationId = 400, DebtorId = 1, Type = LocationDebtorType.MAIN },
        new LocationDebtor { Id=101,LocationId = 400, DebtorId = 2, Type = LocationDebtorType.BASE },
        new LocationDebtor { Id=102,LocationId = 401, DebtorId = 1, Type = LocationDebtorType.MAIN },
        new LocationDebtor { Id=103,LocationId = 500, DebtorId = 500, Type = LocationDebtorType.MAIN },
        new LocationDebtor { Id=104,LocationId = 500, DebtorId = 501, Type = LocationDebtorType.BASE },
        new LocationDebtor { Id=105,LocationId = 501, DebtorId = 500, Type = LocationDebtorType.MAIN }
      );

      context.LocationDebtorHistories.AddRange(
        new LocationDebtorHistory { Id=100, LocationId = 500, DebtorId = 500, Type = LocationDebtorType.MAIN, LastModified = new DateTime(1990, 1, 1), Created = new DateTime(1990, 1, 1), LocationDebtorId = 100 },
        new LocationDebtorHistory { Id=101, LocationId = 500, DebtorId = 501, Type = LocationDebtorType.BASE, LastModified = new DateTime(1990, 1, 1), Created = new DateTime(1990, 1, 1), LocationDebtorId = 100},
        new LocationDebtorHistory { Id=102, LocationId = 501, DebtorId = 500, Type = LocationDebtorType.MAIN, LastModified = new DateTime(1990, 1, 1), Created = new DateTime(1990, 1, 1), LocationDebtorId = 100 }
      );
      //END


      //START: TEST ROLE UPDATE COMMAND
      context.Roles.Add(
        new Role { Id = 100, Name = "Test Role" }
      );
      context.RoleActions.AddRange(
        new RoleAction { Action = Domain.Enums.Action.ASSIGN_COUPON, RoleId = 100 },
        new RoleAction { Action = Domain.Enums.Action.CREATE_LOCATION, RoleId = 100 },
        new RoleAction { Action = Domain.Enums.Action.CREATE_REFILL, RoleId = 100 }
      );
      //END

      //START: MORE DATA FOR THE QUERY TEST
      context.Roles.AddRange(
        new Role { Id = 200, Name = "Test Role 1" },
        new Role { Id = 201, Name = "Test Role 2" },
        new Role { Id = 202, Name = "Test Role 3" },
        new Role { Id = 203, Name = "Test Role 4" }
      );
      //END

      //START: TEST USER ROLE UPDATE COMMAND
      var role1 = new Role { Id = 300, Name = "VeryImportant" };
      var role2 = new Role { Id = 301, Name = "LittleLessImportant" };
      var role3 = new Role { Id = 302, Name = "WhoAreYou?" };
      context.Roles.AddRange(role1, role2, role3);

      var user1 = new User { Id = 500, Username = "LegitUser64", Password = "Password" };
      context.Users.AddRange(
        user1
      );

      context.UserRoles.AddRange(
        new UserRole { Id = 100, User = user1, Role = role1 }
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
