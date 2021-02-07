using System;
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
      private readonly IPasswordHasher _passwordHasher;

      public AssignTokenCommandHandler(IApplicationDbContext context, ITokenService tokenService, IPasswordHasher passwordHasher)
      {
        _context = context;
        _tokenService = tokenService;
        _passwordHasher = passwordHasher;
      }
      public async Task<UserTokenDto> Handle(AssignTokenCommand request, CancellationToken cancellationToken)
      {
        var user = await _context.Users
          .Include(x => x.Roles)
          .ThenInclude(x => x.Role)
          .ThenInclude(x => x.Actions)
          .FirstOrDefaultAsync(x => x.Username.Equals(request.UserDto.Username));

        if (user == null)
        {
          throw new ArgumentException("Invalid credentials.");
        }

        var (verified, needsUpgrade) = _passwordHasher.Check(user.Password, request.UserDto.Password);

        if (!verified) {
          throw new ArgumentException("Invalid credentials.");
        }

        // TODO maybe do something with the needsUpgrade?

        var token = _tokenService.CreateToken(user);
        return new UserTokenDto
        {
          // UserDto = request.UserDto,
          Token = token
        };
      }
    }
  }
}
