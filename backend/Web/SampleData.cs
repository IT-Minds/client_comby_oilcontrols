using System;
using Domain.Entities;
using Domain.Enums;
using Infrastructure.Persistence;

namespace Web
{
  public static class SampleData
  {
    public static void SeedSampleData(ApplicationDbContext context)
    {
      //Clear all the existing data from db before adding new sample data.
      context.Locations.RemoveRange(context.Locations);
      context.Coupons.RemoveRange(context.Coupons);
      context.Refills.RemoveRange(context.Refills);
      context.Trucks.RemoveRange(context.Trucks);
      context.Routes.RemoveRange(context.Routes);
      context.Regions.RemoveRange(context.Regions);
      context.RegionDailyTemps.RemoveRange(context.RegionDailyTemps);
      context.TruckDailyStates.RemoveRange(context.TruckDailyStates);
      context.TruckRefills.RemoveRange(context.TruckRefills);
      context.FuelTanks.RemoveRange(context.FuelTanks);
      context.Streets.RemoveRange(context.Streets);
      context.LocationHistories.RemoveRange(context.LocationHistories);
      context.RoleActions.RemoveRange(context.RoleActions);
      context.UserRoles.RemoveRange(context.UserRoles);
      context.Roles.RemoveRange(context.Roles);
      context.Users.RemoveRange(context.Users);

      var region1 = new Region { };
      context.Regions.Add(region1);
      context.SaveChanges();

      var route1 = new Route { };
      var route2 = new Route { };
      context.Routes.AddRange(
        route1,
        route2
      );
      context.SaveChanges();

      var truck1 = new Truck { RouteId = route1.Id, TruckIdentifier = "Truck1", Name = "Trucky", Description = "Certainly a truck.", TankCapacity = 100000 };
      var truck2 = new Truck { RouteId = route2.Id, TruckIdentifier = "Truck1", Name = "TruckMan", Description = "Truck?", TankCapacity = 100000 };

      context.Trucks.AddRange(
        truck1,
        truck2
      );
      context.SaveChanges();

      var truckDailyState1 = new TruckDailyState { TruckId = truck1.Id, Date = new DateTime(2000, 5, 1) };
      var truckDailyState2 = new TruckDailyState { TruckId = truck1.Id, Date = new DateTime(2000, 5, 2) };
      var truckDailyState3 = new TruckDailyState { TruckId = truck1.Id, Date = new DateTime(2000, 5, 3) };
      var truckDailyState4 = new TruckDailyState { TruckId = truck1.Id, Date = new DateTime(2000, 5, 4) };
      var truckDailyState5 = new TruckDailyState { TruckId = truck1.Id, Date = new DateTime(2000, 5, 5) };
      var truckDailyState6 = new TruckDailyState { TruckId = truck1.Id, Date = new DateTime(2000, 5, 6) };
      var truckDailyState7 = new TruckDailyState { TruckId = truck2.Id, Date = new DateTime(2000, 5, 1) };
      var truckDailyState8 = new TruckDailyState { TruckId = truck2.Id, Date = new DateTime(2000, 5, 2) };
      var truckDailyState9 = new TruckDailyState { TruckId = truck2.Id, Date = new DateTime(2000, 5, 3) };
      var truckDailyState10 = new TruckDailyState { TruckId = truck2.Id, Date = new DateTime(2000, 5, 4) };
      var truckDailyState11 = new TruckDailyState { TruckId = truck2.Id, Date = new DateTime(2000, 5, 5) };
      var truckDailyState12 = new TruckDailyState { TruckId = truck2.Id, Date = new DateTime(2000, 5, 6) };

      context.TruckDailyStates.AddRange(
        truckDailyState1,
        truckDailyState2,
        truckDailyState3,
        truckDailyState4,
        truckDailyState5,
        truckDailyState6,
        truckDailyState7,
        truckDailyState8,
        truckDailyState9,
        truckDailyState10,
        truckDailyState11,
        truckDailyState12
      );
      context.SaveChanges();

      var fueltank1 = new FuelTank { TankNumber = 1000, FuelType = FuelType.GASOLINE, TankType = TankType.BUILDING, TankCapacity = 10000, MinimumFuelAmount = 500 };
      var fueltank2 = new FuelTank { TankNumber = 1001, FuelType = FuelType.OIL, TankType = TankType.SHIP, TankCapacity = 20000, MinimumFuelAmount = 450 };
      var fueltank3 = new FuelTank { TankNumber = 1002, FuelType = FuelType.PETROLEUM, TankType = TankType.TANK, TankCapacity = 35000, MinimumFuelAmount = 300 };
      var fueltank4 = new FuelTank { TankNumber = 1003, FuelType = FuelType.OTHER, TankType = TankType.BUILDING, TankCapacity = 30000, MinimumFuelAmount = 375 };

      context.FuelTanks.AddRange(
        fueltank1,
        fueltank2,
        fueltank3,
        fueltank4
      );
      context.SaveChanges();

      var location1 = new Location { Address = "StreetName 1", Comments = "This is location", EstimateFuelConsumption = 5, FuelTankId = fueltank1.Id, RegionId = region1.Id, Schedule = RefillSchedule.AUTOMATIC, DaysBetweenRefills = 14 };
      var location2 = new Location { Address = "StreetName 2", Comments = "This is another location", EstimateFuelConsumption = 5, FuelTankId = fueltank1.Id, RegionId = region1.Id, Schedule = RefillSchedule.INTERVAL, DaysBetweenRefills = 10 };
      var location3 = new Location { Address = "Another Street 35", Comments = "This is the location", EstimateFuelConsumption = 5, FuelTankId = fueltank1.Id, RegionId = region1.Id, Schedule = RefillSchedule.MANUAL, DaysBetweenRefills = 300 };
      var location4 = new Location { Address = "The First Street 43", Comments = "This is yet another location", EstimateFuelConsumption = 5, FuelTankId = fueltank1.Id, RegionId = region1.Id, Schedule = RefillSchedule.AUTOMATIC, DaysBetweenRefills = 45 };

      context.Locations.AddRange(
        location1,
        location2,
        location3,
        location4
      );
      context.SaveChanges();

      var coupon1 = new Coupon { CouponNumber = 19991, TruckId = truck1.Id, Created = DateTimeOffset.Now };
      var coupon2 = new Coupon { CouponNumber = 19992, TruckId = truck1.Id, Created = DateTimeOffset.Now };
      var coupon3 = new Coupon { CouponNumber = 19993, TruckId = truck1.Id, Created = DateTimeOffset.Now };
      var coupon4 = new Coupon { CouponNumber = 19994, TruckId = truck1.Id, Created = DateTimeOffset.Now };
      var coupon5 = new Coupon { CouponNumber = 19995, TruckId = truck1.Id, Created = DateTimeOffset.Now };
      var coupon6 = new Coupon { CouponNumber = 19996, TruckId = truck2.Id, Created = DateTimeOffset.Now };
      var coupon7 = new Coupon { CouponNumber = 19997, TruckId = truck2.Id, Created = DateTimeOffset.Now };
      var coupon8 = new Coupon { CouponNumber = 19998, TruckId = truck2.Id, Created = DateTimeOffset.Now };
      var coupon9 = new Coupon { CouponNumber = 19999, TruckId = truck2.Id, Created = DateTimeOffset.Now };
      var coupon10 = new Coupon { CouponNumber = 20000, TruckId = truck2.Id, Created = DateTimeOffset.Now };

      context.Coupons.AddRange(
        coupon1,
        coupon2,
        coupon3,
        coupon4,
        coupon5,
        coupon6,
        coupon7,
        coupon8,
        coupon9,
        coupon10
      );
      context.SaveChanges();

      var refill1 = new Refill { CouponId = coupon1.Id, StartAmount = 200, EndAmount = 10000, TankState = TankState.FULL, ExpectedDeliveryDate = new DateTime(2000, 5, 1), ActualDeliveryDate = new DateTime(2000, 5, 1), LocationId = location1.Id };
      var refill2 = new Refill { CouponId = coupon2.Id, StartAmount = 1000, EndAmount = 10000, TankState = TankState.FULL, ExpectedDeliveryDate = new DateTime(2000, 5, 10), ActualDeliveryDate = new DateTime(2000, 5, 10), LocationId = location1.Id };
      var refill3 = new Refill { CouponId = coupon3.Id, StartAmount = 1000, EndAmount = 10000, TankState = TankState.FULL, ExpectedDeliveryDate = new DateTime(2000, 5, 20), ActualDeliveryDate = new DateTime(2000, 5, 20), LocationId = location1.Id };
      var refill4 = new Refill { ExpectedDeliveryDate = new DateTime(2000, 5, 1), ActualDeliveryDate = new DateTime(2000, 5, 30), LocationId = location1.Id };

      context.Refills.AddRange(
        refill1,
        refill2,
        refill3,
        refill4
      );
      context.SaveChanges();

      context.TruckRefills.AddRange(
       new TruckRefill { TimeStamp = new DateTime(2000, 1, 1), FuelCardNumber = 125, Amount = 100000, FuelType = FuelType.GASOLINE, TruckDailyStateId = truckDailyState1.Id },
        new TruckRefill { TimeStamp = new DateTime(2000, 1, 6), FuelCardNumber = 125, Amount = 100000, FuelType = FuelType.GASOLINE, TruckDailyStateId = truckDailyState6.Id }
      );

      DateTime period = new DateTime(1995, 5, 1);
      var rand = new Random();
      while (period.Year < 2001)
      {
        context.RegionDailyTemps.Add(
          new RegionDailyTemp { RegionId = region1.Id, Date = period, Temperature = rand.Next(-30, 30) }
        );
        period = period.AddDays(1);
        if (period.Month != 5) period = period.AddYears(1);
      }

      var street1 = new Street { Name = "StreetName", RegionId = region1.Id };
      var street2 = new Street { Name = "Another Street", RegionId = region1.Id };
      var street3 = new Street { Name = "The First Street", RegionId = region1.Id };

      context.Streets.AddRange(
        street1,
        street2,
        street3
      );

      var user1 = new User{Username = "Test User", Password = "Password"};
      context.Users.Add( user1 );
      var role1 =  new Role{Name = "Test Role"};
      context.Roles.Add(role1);
      context.SaveChanges();
      context.RoleActions.AddRange(
        new RoleAction{RoleId = role1.Id, Action = Domain.Enums.Action.ASSIGN_COUPON}
      );
      context.UserRoles.AddRange(
        new UserRole{RoleId = role1.Id, UserId = user1.Id}
      );



      context.SaveChanges();
    }
  }
}
