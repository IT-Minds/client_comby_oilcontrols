using Application.Common.Interfaces;
using Domain.Common;
using Domain.Entities;
using Domain.Entities.Refills;
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

    public DbSet<CompletedRefill> CompletedRefills { get; set; }
    public DbSet<OrderedRefill> OrderedRefills { get; set; }
    public DbSet<AssignedRefill> AssignedRefills { get; set; }

    public DbSet<Truck> Trucks { get; set; }
    public DbSet<Region> Regions { get; set; }
    public DbSet<RegionDailyTemp> RegionDailyTemps { get; set; }
    public DbSet<TruckDailyState> TruckDailyStates { get; set; }
    public DbSet<TruckRefill> TruckRefills { get; set; }
    public DbSet<FuelTank> FuelTanks { get; set; }
    public DbSet<Street> Streets { get; set; }
    public DbSet<LocationHistory> LocationHistories { get; set; }
    public DbSet<Debtor> Debtors { get; set; }
    public DbSet<LocationDebtor> LocationDebtors { get; set; }
    public DbSet<LocationDebtorHistory> LocationDebtorHistories { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<RoleAction> RoleActions { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<UserRole> UserRoles { get; set; }

    private void PrepareEntitiesForSave()
    {
      var entities = ChangeTracker.Entries<AuditableEntity>();
      foreach (var entry in entities)
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
            break;
        }
      }

      OnLocationsChange(entities.Where(x => x.Entity.GetType().Equals(typeof(Location))));
      OnLocationDebtorRelationChange(entities.Where(x => x.Entity.GetType().Equals(typeof(LocationDebtor))));
    }

    public async override Task<int> SaveChangesAsync(CancellationToken cancellationToken = new CancellationToken())
    {
      PrepareEntitiesForSave();
      var result = await base.SaveChangesAsync(cancellationToken);
      return result;
    }

    public override int SaveChanges()
    {
      PrepareEntitiesForSave();
      var result = base.SaveChanges();
      return result;
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
      builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

      base.OnModelCreating(builder);
    }

    public virtual EntityEntry Entry(AuditableEntity entity)
    {
      return base.Entry(entity);
    }

    public void Replace<TEntity>(TEntity oldEntity, TEntity newEntity) where TEntity : AuditableEntity
    {
        ChangeTracker.TrackGraph(oldEntity, e => e.Entry.State = EntityState.Deleted);
        ChangeTracker.TrackGraph(newEntity, e => e.Entry.State = e.Entry.IsKeySet ? EntityState.Modified : EntityState.Added);
    }

    private void OnLocationsChange(IEnumerable<EntityEntry<AuditableEntity>> entities)
    {
      foreach (EntityEntry<AuditableEntity> entity in entities.ToList())
      {
        if (entity.State == EntityState.Added || entity.State == EntityState.Modified)
        {
          var locationHistory = new LocationHistory
          {
            RegionId = (entity.Entity as Location).RegionId,
            Schedule = (entity.Entity as Location).Schedule,
            Address = (entity.Entity as Location).Address,
            AddressExtra = (entity.Entity as Location).AddressExtra,
            Comments = (entity.Entity as Location).Comments,
            Location = (entity.Entity as Location),
            CreatedBy = _currentUserService.UserId,
            Created = _dateTimeOffsetService.Now,
            LastModifiedBy = _currentUserService.UserId,
            LastModified = _dateTimeOffsetService.Now,
            ModifiedCount = 0,
          };

          this.LocationHistories.Add(locationHistory);
        }
      }
    }

    private void OnLocationDebtorRelationChange(IEnumerable<EntityEntry<AuditableEntity>> entities)
    {
      foreach (EntityEntry<AuditableEntity> entity in entities.ToList())
      {
        if (entity.State == EntityState.Added || entity.State == EntityState.Modified)
        {
          var locationDebtorHist = new LocationDebtorHistory
          {
            LocationDebtorId = (entity.Entity as LocationDebtor).Id,
            LocationId = (entity.Entity as LocationDebtor).LocationId,
            DebtorId = (entity.Entity as LocationDebtor).DebtorId,
            Type = (entity.Entity as LocationDebtor).Type,
            Created = _dateTimeOffsetService.Now,
            LastModified = _dateTimeOffsetService.Now,
            CreatedBy = _currentUserService.UserId,
            LastModifiedBy = _currentUserService.UserId,
            ModifiedCount = 0
          };

          this.LocationDebtorHistories.Add(locationDebtorHist);
        }
      }
    }
  }
}
