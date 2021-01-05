using Application.Common.Interfaces;
using MediatR.Pipeline;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Common.Behaviours
{
  public class LoggingBehaviour<TRequest> : IRequestPreProcessor<TRequest>
  {
    private readonly ILogger _logger;
    private readonly ICurrentUserService _currentUserService;

    public LoggingBehaviour(ILogger<TRequest> logger, ICurrentUserService currentUserService)
    {
      _logger = logger;
      _currentUserService = currentUserService;
    }

#pragma warning disable 1998
    public async Task Process(TRequest request, CancellationToken cancellationToken)
    {
      var requestName = typeof(TRequest).Name;
      var userId = _currentUserService.UserId ?? string.Empty;

      _logger.LogInformation("Request: {Name} {@UserId} {@UserId} {@Request}",
          requestName, userId, userId, request);
    }
#pragma warning restore 1998
  }
}
