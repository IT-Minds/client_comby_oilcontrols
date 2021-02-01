using Application.Common.Options;
using Domain.Entities;

namespace Application.Common.Interfaces
{
  public interface ITokenService
  {
    string CreateToken(User user);
  }
}