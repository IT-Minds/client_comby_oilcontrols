using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Users.Commands.AssignToken
{
  public class AssignTokenCommand : IRequest<UserTokenDto>
  {
    public UserDto UserDto { get; set; }

    public class AssignTokenCommandHandler : IRequestHandler<AssignTokenCommand, UserTokenDto>
    {
      private readonly IApplicationDbContext _context;
      private readonly ITokenService _tokenService;

      public AssignTokenCommandHandler(IApplicationDbContext context, ITokenService tokenService)
      {
        _context = context;
        _tokenService = tokenService;
      }
      public async Task<UserTokenDto> Handle(AssignTokenCommand request, CancellationToken cancellationToken)
      {
        var user = await _context.Users
          .Include(x => x.Roles)
          .ThenInclude(x => x.Role)
          .ThenInclude(x => x.Actions)
          .FirstOrDefaultAsync(x => x.Username.Equals(request.UserDto.Username) && x.Password.Equals(request.UserDto.Password));
        if (user == null)
        {
          throw new ArgumentException("Invalid credentials.");
        }
        var token = _tokenService.CreateToken(user);
        return new UserTokenDto
        {
          UserDto = request.UserDto,
          Token = token
        };
      }
    }
  }
}