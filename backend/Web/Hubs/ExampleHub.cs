using Microsoft.AspNetCore.SignalR;

namespace Web.Hubs
{
  public class ExampleHub : Hub
  {
    //public async Task SendMessage(string userName, string message)
    //{
    //    await Clients.All.SendAsync("ReceiveMessage", userName, message, DateTimeOffset.UtcNow.ToUnixTimeMilliseconds());
    //}
  }
}
