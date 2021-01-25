using Application.Common.Interfaces;
using Domain.Common;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;

namespace Infrastructure.Persistence
{
  public class ApplicationDbContext : DbContext, IApplicationDbContext
  {
    private readonly ICurrentUserService _currentUserService;
    private readonly IDateTimeOffsetService _dateTimeOffsetService;

    public ApplicationDbContext(
        DbContextOptions options,
        ICurrentUserService currentUserService,
        IDateTimeOffsetService dateTimeOffset) : base(options)
    {
      _currentUserService = currentUserService;
      _dateTimeOffsetService = dateTimeOffset;
    }

    public DbSet<ExampleEntity> ExampleEntities { get; set; }

    public DbSet<ExampleEntityList> ExampleEntityLists { get; set; }
    public DbSet<Location> Locations { get; set; }
    public DbSet<Coupon> Coupons { get; set; }
    public DbSet<Refill> Refills { get; set; }
    public DbSet<Truck> Trucks { get; set; }
    public DbSet<Route> Routes { get; set; }
    public DbSet<Region> Regions { get; set; }
    public DbSet<RegionDailyTemp> RegionDailyTemps { get; set; }
    public DbSet<TruckDailyState> TruckDailyStates { get; set; }
    public DbSet<TruckRefill> TruckRefills { get; set; }
    public DbSet<FuelTank> FuelTanks { get; set; }
    public DbSet<Street> Streets { get; set; }
    public DbSet<LocationHistory> LocationHistories { get; set; }

    public async override Task<int> SaveChangesAsync(CancellationToken cancellationToken = new CancellationToken())
    {
      foreach (var entry in ChangeTracker.Entries<AuditableEntity>().ToList())
      {
        switch (entry.State)
        {
          case EntityState.Added:
            entry.Entity.CreatedBy = _currentUserService.UserId;
            entry.Entity.Created = _dateTimeOffsetService.Now;
            entry.Entity.LastModifiedBy = _currentUserService.UserId;
            entry.Entity.LastModified = _dateTimeOffsetService.Now;
            entry.Entity.ModifiedCount = 0;
            break;
          case EntityState.Modified:
            entry.Entity.LastModifiedBy = _currentUserService.UserId;
            entry.Entity.LastModified = _dateTimeOffsetService.Now;
            entry.Entity.ModifiedCount++;
            if (entry.Entity.GetType().Equals(typeof(Location)))
            {
              OnLocationChange(entry.Entity as Location);
            }
            break;
        }
      }

      var result = await base.SaveChangesAsync(cancellationToken);

#pragma warning disable 4014
      OnLocationsChange(ChangeTracker.Entries<AuditableEntity>()
        .Where(x => x.Entity.GetType().Equals(typeof(Location))), cancellationToken);
#pragma warning restore 4014

      return result;
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
      builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

      base.OnModelCreating(builder);
    }

    private Task OnLocationsChange(IEnumerable<EntityEntry<AuditableEntity>> entities, CancellationToken cancellationToken)
    {
      foreach (var entity in entities)
      {
        if (entity.State == EntityState.Added || entity.State == EntityState.Modified)
        {
          var locationHistory = new LocationHistory
          {
            RegionId = (entity.Entity as Location).RegionId,
            Schedule = (entity.Entity as Location).Schedule,
            Address = (entity.Entity as Location).Address,
            Comments = (entity.Entity as Location).Comments,
            LocationId = (entity.Entity as Location).Id
          };
          entity.Entity.CreatedBy = _currentUserService.UserId;
          entity.Entity.Created = _dateTimeOffsetService.Now;
          entity.Entity.LastModifiedBy = _currentUserService.UserId;
          entity.Entity.LastModified = _dateTimeOffsetService.Now;
          entity.Entity.ModifiedCount = 0;

          this.LocationHistories.Add(locationHistory);
        }
      }

      return base.SaveChangesAsync(cancellationToken);
    }
  }
}
