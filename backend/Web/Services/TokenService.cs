using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Application.Common.Interfaces;
using Application.Common.Options;
using Domain.Entities;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Web.Services
{
  public class TokenService : ITokenService
  {
    private const double EXPIRE_HOURS = 4.0;
    private readonly TokenOptions _options;

    public TokenService(IOptions<TokenOptions> options)
    {
      _options = options.Value;
    }

    public string CreateToken(User user)
    {
      var claims = new List<Claim>();
      claims.Add(new Claim(ClaimTypes.NameIdentifier, user.Username));
      foreach(var role in user.Roles)
      {
        foreach(RoleAction action in role.Role.Actions)
        {
          claims.Add(new Claim(ClaimTypes.Role, System.Enum.GetName(action.Action)));
        }
      }
      var key = Encoding.ASCII.GetBytes(_options.Secret);
      var tokenHandler = new JwtSecurityTokenHandler();
      var descriptor = new SecurityTokenDescriptor
      {
        Subject = new ClaimsIdentity(claims),
        Expires = DateTime.UtcNow.AddHours(EXPIRE_HOURS),
        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
      };
      var token = tokenHandler.CreateToken(descriptor);
      return tokenHandler.WriteToken(token);
    }
  }
}