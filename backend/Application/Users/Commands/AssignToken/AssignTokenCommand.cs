using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Users.Commands.AssignToken
{
  public class AssignTokenCommand : IRequest<UserTokenDto>
  {
    public string Username { get; set; }
    public string Password { get; set; }

    public class AssignTokenCommandHandler : IRequestHandler<AssignTokenCommand, UserTokenDto>
    {
      private readonly IApplicationDbContext _context;
      private readonly ITokenService _tokenService;
      private readonly IPasswordHasher _passwordHasher;
      private readonly IMapper _mapper;

      public AssignTokenCommandHandler(IApplicationDbContext context, ITokenService tokenService, IPasswordHasher passwordHasher, IMapper mapper)
      {
        _context = context;
        _tokenService = tokenService;
        _passwordHasher = passwordHasher;
        _mapper = mapper;
      }

      public async Task<UserTokenDto> Handle(AssignTokenCommand request, CancellationToken cancellationToken)
      {
        var user = await _context.Users
          .Include(x => x.Roles)
            .ThenInclude(x => x.Role)
              .ThenInclude(x => x.Actions)
          .FirstOrDefaultAsync(x => x.Username.Equals(request.Username));

        if (user == null)
        {
          throw new ArgumentException("Invalid credentials.");
        }

        var (verified, needsUpgrade) = _passwordHasher.Check(user.Password, request.Password);

        if (!verified) {
          throw new ArgumentException("Invalid credentials.");
        }

        // TODO maybe do something with the needsUpgrade?

        var token = _tokenService.CreateToken(user);
        return new UserTokenDto
        {
          User = _mapper.Map<UserIdDto>(user),
          Token = token
        };
      }
    }
  }
}
