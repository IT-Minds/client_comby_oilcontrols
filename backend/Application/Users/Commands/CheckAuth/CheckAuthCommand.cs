using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Security;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Users.Commands.AssignToken
{
  [Authenticated]
  public class CheckAuthCommand : IRequest<UserIdDto>
  {
    public class CheckAuthCommandHandler : IRequestHandler<CheckAuthCommand, UserIdDto>
    {
      private readonly IApplicationDbContext _context;
      private readonly ICurrentUserService _userAuthService;
      private readonly IMapper _mapper;


      public CheckAuthCommandHandler(IApplicationDbContext context, ICurrentUserService userAuthService, IMapper mapper)
      {
        _context = context;
        _userAuthService = userAuthService;
        _mapper = mapper;
      }

      public async Task<UserIdDto> Handle(CheckAuthCommand request, CancellationToken cancellationToken)
      {
        var user = await _context.Users
          .Include(u => u.Roles)
            .ThenInclude(r => r.Role)
              .ThenInclude(r => r.Actions)
          .FirstOrDefaultAsync(u => u.Username == _userAuthService.UserId);

        if (user == null) {
          // throw 401??
          throw new ArgumentException("Invalid credentials.");
        }

        return _mapper.Map<UserIdDto>(user);
      }
    }
  }
}
