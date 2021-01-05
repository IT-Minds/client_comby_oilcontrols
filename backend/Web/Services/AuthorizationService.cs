using Application.Common.Interfaces;
using Microsoft.AspNetCore.Http;
using System;

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

    public bool HasPolicy(string policyName)
    {
      throw new NotImplementedException();
    }
  }
}
