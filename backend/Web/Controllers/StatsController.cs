using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Services;
using Application.Stats.GetHistoricConsumption;
using Application.Stats.GetRefillOfYear;
using Domain.Enums;
using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers
{
  public class StatsController : ApiControllerBase
  {
    [HttpGet("refillHistoryFile")]
    public async Task<FileContentResult> GetRefillOfYearFile([FromQuery] int year)
    {
      var data = await Mediator.Send(new GetRefillOfYearQuery
      {
        Year = year
      });

      System.Net.Mime.ContentDisposition cd = new System.Net.Mime.ContentDisposition
      {
        FileName = data.Filename,
        Inline = false
      };
      Response.Headers.Add("Content-Disposition", cd.ToString());
      Response.Headers.Add("Access-Control-Expose-Headers", "Content-Disposition");

      return File(data.Stream, "text/csv", data.Filename); ;
    }

    [HttpGet("usageHistoryFile")]
    public async Task<FileContentResult> GetUsageHistoryFile([FromQuery] int locationId, [FromQuery] Interval interval, [FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
    {
      var data = await Mediator.Send(new GetHistoricConsumptionCsvQuery
      {
        Dto = new HistoricConsumptionDto
        {
          LocationId = locationId,
          Interval = interval,
          StartDate = startDate,
          EndDate = endDate
        }
      });
      System.Net.Mime.ContentDisposition cd = new System.Net.Mime.ContentDisposition
      {
        FileName = data.Filename,
        Inline = false
      };

      Response.Headers.Add("Content-Disposition", cd.ToString());
      Response.Headers.Add("Access-Control-Expose-Headers", "Content-Disposition");

      return File(data.Stream, "text/csv", data.Filename); ;
    }

    [HttpGet("usageHistory")]
    public async Task<ActionResult<List<FuelConsumptionDto>>> GetUsageHistory([FromQuery] int locationId, [FromQuery] Interval interval, [FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
    {
      var data = await Mediator.Send(new GetHistoricConsumptionQuery
      {
        Dto = new HistoricConsumptionDto
        {
          LocationId = locationId,
          Interval = interval,
          StartDate = startDate,
          EndDate = endDate
        }
      });
      return data.ToList();
    }
  }

  public class TEMP_DTO
  {
    public string DATA { get; set; }
  }

  public enum TEMP_USAGE_HISTORY
  {
    MONTHLY = 0,
    QUARTERLY = 1,
    YEARLY = 2
  }
}
