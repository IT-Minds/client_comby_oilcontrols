using System.Threading.Tasks;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers
{

  public class HealthController : ApiControllerBase
  {
    readonly ApplicationDbContext _context;
    public HealthController(ApplicationDbContext context)
    {
      this._context = context;
    }

    [HttpGet]
    public async Task<ActionResult<bool>> Get()
    {
      using (_context)
      {
        var result =  await _context.Database.CanConnectAsync();
        return result;
      }
    }
  }
}
