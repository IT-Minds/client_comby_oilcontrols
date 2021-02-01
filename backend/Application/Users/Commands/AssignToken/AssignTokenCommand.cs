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
        var user = await _context.Users.FirstOrDefaultAsync(x => x.Username.Equals(request.UserDto.Username));
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