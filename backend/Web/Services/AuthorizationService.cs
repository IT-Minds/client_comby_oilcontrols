using Application.Common.Interfaces;
using Microsoft.AspNetCore.Http;
using System;
using System.Linq;
using System.Security.Claims;

namespace Web.Services
{
  public class AuthorizationService : IAuthorizationService
  {
    private readonly IHttpContextAccessor _httpContextAccessor;

    public AuthorizationService(IHttpContextAccessor httpContextAccessor)
    {
      _httpContextAccessor = httpContextAccessor;
    }

    public bool IsInRole(string role)
    {
      throw new NotImplementedException();
    }

    public bool HasPolicy(Domain.Enums.Action policy)
    {
      Console.WriteLine("######### USER");
      Console.WriteLine(_httpContextAccessor.HttpContext.User.Identity);
      var userClaims = _httpContextAccessor.HttpContext.User.Claims;
      Console.WriteLine("########### CLAIMS");
      foreach(Claim claim in userClaims)
      {
        Console.WriteLine("TYPE {0} VALUE {1}", claim.Type, claim.Value);
      }
      Console.WriteLine();
      var policies = _httpContextAccessor.HttpContext.Request.Headers
        .Where(x => x.Key.Equals("Authorization"))
        .Where(x => x.Value.Equals(policy.ToString()));

      return policies != null && policies.Count() > 0;
    }
  }
}
