using System.Collections.Generic;
using System.Security.Claims;

namespace Application.Common.Interfaces
{
  public interface IAuthorizationService
  {
    bool HasPolicy(Domain.Enums.Action policy);
  }
}
