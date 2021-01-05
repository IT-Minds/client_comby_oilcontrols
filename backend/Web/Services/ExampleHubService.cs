using Application.Common.Interfaces.Hubs;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;
using Web.Hubs;

namespace Web.Services
{
  public class ExampleHubService : IExampleHubService
  {
    private readonly IHubContext<ExampleHub> _hubContext;

    public ExampleHubService(IHubContext<ExampleHub> hubContext)
    {
      _hubContext = hubContext;
    }

    public async Task SendMessage(string userName, string message)
    {
      await _hubContext.Clients.All.SendAsync("ReceiveMessage", userName, message, DateTimeOffset.UtcNow.ToUnixTimeMilliseconds());
    }
  }
}
