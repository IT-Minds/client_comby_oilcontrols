using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Security;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Users.Commands.DeleteUser
{
  [AuthorizeAttribute(Domain.Enums.Action.DELETE_USER)]
  public class DeleteUserCommand : IRequest<UserDto>
  {
    public int UserId;

    public class DeleteUserCommandHandler : IRequestHandler<DeleteUserCommand, UserDto>
    {
      private readonly IApplicationDbContext _context;
      private readonly IMapper _mapper;

      public DeleteUserCommandHandler(IApplicationDbContext context, IMapper mapper)
      {
        _context = context;
        _mapper = mapper;
      }

      public async Task<UserDto> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
      {
        var user = _context.Users
          .Include(x => x.Truck)
          .Include(x => x.Roles)
          .FirstOrDefault(x => x.Id == request.UserId);

        if (user == null)
        {
          throw new ArgumentException("No user with ID: " + request.UserId);
        }

        var userDto = _mapper.Map<UserDto>(user);

        _context.Users.Remove(user);
        await _context.SaveChangesAsync(cancellationToken);

        return userDto;
      }
    }
  }
}