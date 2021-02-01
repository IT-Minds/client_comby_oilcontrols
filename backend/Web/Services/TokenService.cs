using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Application.Common.Options;
using Domain.Entities;
using Microsoft.IdentityModel.Tokens;

namespace Web.Services
{
  public class TokenService
  {
    private const double EXPIRE_HOURS = 4.0;
    private readonly TokenOptions _options;

    public TokenService(TokenOptions options)
    {
      _options = options;
    }

    public string CreateToken(User user)
    {
      var key = Encoding.ASCII.GetBytes(_options.Secret);
      var tokenHandler = new JwtSecurityTokenHandler();
      var descriptor = new SecurityTokenDescriptor
      {
        Subject = new ClaimsIdentity(new Claim[]
        {
          new Claim(ClaimTypes.Name, user.UserName.ToString())
        }),
        Expires = DateTime.UtcNow.AddHours(EXPIRE_HOURS),
        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
      };
      var token = tokenHandler.CreateToken(descriptor);
      return tokenHandler.WriteToken(token);
    }
  }
}