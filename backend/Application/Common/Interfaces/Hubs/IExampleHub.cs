using System.Threading.Tasks;

namespace Application.Common.Interfaces.Hubs
{
  public interface IExampleHubService
  {
    Task SendMessage(string userName, string message);
  }
}
