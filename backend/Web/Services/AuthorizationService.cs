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
      //TODO: Remove all the writelines when I have figures out how this is supposed to work.
      var headers = _httpContextAccessor.HttpContext.Request.Headers.ToList();
      Console.WriteLine("############## HEADERS");
      foreach (var header in headers)
      {
        Console.WriteLine(header);
      }
      var items = _httpContextAccessor.HttpContext.Items.ToList();
      Console.WriteLine("############## ITEMS");
      foreach (var item in items)
      {
        Console.WriteLine("{0} : {1}", item.Key, item.Value);
      }
      Console.WriteLine("############# USER: {0}", _httpContextAccessor.HttpContext.User.ToString());
      var allclaims = _httpContextAccessor.HttpContext?.User?.Claims.ToList();
      Console.WriteLine("############## ALL CLAIMS {0}", allclaims.Count());
      foreach (var claim in allclaims)
      {
        Console.WriteLine(claim);
      }
      var claims = _httpContextAccessor.HttpContext?.User?.Claims.Where(c => c.Type == "policies");
      var policyMatch = claims.SelectMany(x => x.Value).ToList().Where(x => x.Equals(policy));
      var result = policyMatch != null && policyMatch.Count() > 0;
      return result;
    }
  }
}
