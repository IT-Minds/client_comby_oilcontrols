using System.Threading.Tasks;
using Application.Stats.GetRefillOfYear;
using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers
{
  public class StatsController : ApiControllerBase
  {
    [HttpGet("refillHistoryFile")]
    public async Task<FileContentResult> GetRefillOfYearFile([FromQuery] int year)
    {
      var data = await Mediator.Send(new GetRefillOfYearQuery{
        Year = year
      });

      System.Net.Mime.ContentDisposition cd = new System.Net.Mime.ContentDisposition
      {
            FileName = data.Filename,
            Inline = false
      };
      Response.Headers.Add("Content-Disposition", cd.ToString());
      Response.Headers.Add("Access-Control-Expose-Headers", "Content-Disposition");

      return File(data.Stream, "text/csv", data.Filename);;
    }

    [HttpGet("usageHistoryFile")]
    public async Task<FileContentResult> GetUsageHistoryFile([FromQuery] TEMP_USAGE_HISTORY type)
    {
      var data = new byte[] { };

      return File(data, "text/csv", "TEMP.csv");
    }

    [HttpGet("usageHistory")]
    public async Task<ActionResult<TEMP_DTO>> GetUsageHistory([FromQuery] TEMP_USAGE_HISTORY type)
    {

      return NoContent();
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
