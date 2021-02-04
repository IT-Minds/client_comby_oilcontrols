using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Common.Security;
using MediatR;
using System;
using System.Linq;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Common.Behaviours
{
  public class AuthorizationBehaviour<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
  {
    private readonly ICurrentUserService _currentUserService;
    private readonly IAuthorizationService _identityService;

    public AuthorizationBehaviour(
        ICurrentUserService currentUserService,
        IAuthorizationService identityService)
    {
      _currentUserService = currentUserService;
      _identityService = identityService;
    }

    public async Task<TResponse> Handle(TRequest request, CancellationToken cancellationToken, RequestHandlerDelegate<TResponse> next)
    {
      var authenticatedAttribute = request.GetType().GetCustomAttributes<AuthenticatedAttribute>();
      if (authenticatedAttribute.Any()) {
        if (_currentUserService.UserId == null)
        {
           throw new UnauthorizedAccessException();
        }
      }

      var authorizeAttributes = request.GetType().GetCustomAttributes<AuthorizeAttribute>();
      if (authorizeAttributes.Any())
      {

        // Must be authenticated user
        if (_currentUserService.UserId == null)
        {
          throw new UnauthorizedAccessException();
        }

        // Policy-based authorization
        var authorizeAttributesWithPolicies = authorizeAttributes.SelectMany(a => a.Policies).ToList();
        if (authorizeAttributesWithPolicies.Any())
        {
          foreach (var policy in authorizeAttributesWithPolicies)
          {
            var authorized = _identityService.HasPolicy(policy);
            if (!authorized)
            {
              throw new ForbiddenAccessException();
            }
          }
        }
      }
      // User is authorized / authorization not required
      return await next();
    }
  }
}
