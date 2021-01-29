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
      var claims = _httpContextAccessor.HttpContext?.User?.Claims.Where(c => c.Type == "policies");
      var policyMatch = claims.SelectMany(x => x.Value).ToList().Where(x => x.Equals(policy));
      var result = policyMatch != null && policyMatch.Count() > 0;
      return result;
    }
  }
}
