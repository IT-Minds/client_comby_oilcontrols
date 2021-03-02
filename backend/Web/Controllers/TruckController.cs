using Application.Trucks.Commands.CreateTruck;
using Application.Common.Interfaces.Pagination;
using Application.Trucks.Commands.UpdateTruck;
using Application.Trucks;
using Application.Trucks.Queries.GetTruckInfo;
using Application.Trucks.Queries.GetTrucksPage;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Collections.Generic;
using Application.Locations;
using Application.Locations.Queries;
using Application.Coupons.Queries.GetCoupons.Truck;
using System;
using Application.Coupons.Queries.GetCoupons;
using Application.TruckRefills.Commands.CreateTruckRefill;
using Application.Refills.Queries;
using Application.Refills;
using Application.Coupons;

namespace Web.Controllers
{
  public class TruckController : ApiControllerBase
  {
    [HttpGet("{id}")]
    public async Task<ActionResult<TruckInfoDetailsDto>> GetTruck([FromRoute] int id)
    {
      return await Mediator.Send(new GetTruckInfoQuery { Id = id });
    }

    [HttpGet("{id}/coupons")]
    public async Task<ActionResult<PageResult<CouponIdDto, int>>> GetTrucksCoupons(
      [FromRoute] int id, [FromQuery] int? needle, [FromQuery] int size = 1000, [FromQuery] int? skip = 0, [FromQuery] bool? includeDestroyedCoupons = false
    )
    {
      if (needle == null)
      {
        needle = 0;
      }

      return await Mediator.Send(new GetCouponsTruckQuery
      {
        Size = size,
        Needle = (int)needle,
        Skip = skip,
        TruckId = id,
        IncludeDestroyedCoupons = (bool)includeDestroyedCoupons
      });
    }

    [HttpGet]
    public async Task<ActionResult<PageResult<TruckInfoIdDto, int>>> GetTrucks(
      [FromQuery] int needle = 0, [FromQuery] int size = 1000, [FromQuery] int skip = 0
    )
    {
      return await Mediator.Send(new GetTrucksPageQuery
      {
        Needle = needle,
        Size = size,
        Skip = skip
      });
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<TruckInfoIdDto>> UpdateTruck([FromRoute] int id, UpdateTruckCommand command)
    {
      command.Id = id;
      return await Mediator.Send(command);
    }

    [HttpPost]
    public async Task<ActionResult<TruckInfoIdDto>> CreateTruck(CreateTruckCommand command)
    {
      return await Mediator.Send(command);
    }

    [HttpGet("{id}/runList")]
    // [ResponseCache(Duration = 43200)] // 12 hour cache
    public async Task<ActionResult<IList<LocationRefillDto>>> GetTrucksRefills([FromRoute] int id)
    {
      return await Mediator.Send(new GetLocationRequiringRefill
      {
        TruckId = id
      });
    }

    [HttpGet("{id}/refillHistory")]
    [ResponseCache(Duration = 43200)] // 12 hour cache
    public async Task<ActionResult<PageResult<RefillDto, DateTimeOffset>>> GetRefillHistory(
    [FromRoute] int id, [FromQuery] DateTimeOffset? needle = null, [FromQuery] int size = 1000, [FromQuery] int? skip = 0)
    {
      if (!needle.HasValue)
      {
        needle = DateTimeOffset.MaxValue;
      }

      return await Mediator.Send(new GetLocationRefillHistoryQuery
      {
        LocationId = id,
        Needle = (DateTimeOffset)needle,
        Size = size,
        Skip = skip
      });
    }

    [HttpPost("{id}/refuel")]
    public async Task<ActionResult<int>> CreateTruckRefuel([FromRoute] int id, [FromBody] CreateTruckRefillCommand command)
    {
      command.TruckId = id;
      return await Mediator.Send(command);
    }
  }
}
