using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Security;
using Domain.Entities;
using MediatR;

namespace Application.Users.Commands.CreateUser
{
  [AuthorizeAttribute(Domain.Enums.Action.CREATE_USER)]
  public class CreateUserCommand : IRequest<int>
  {
    public string UserName { get; set; }
    public string Password { get; set; }
    public int RoleId { get; set; }

    public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, int>
    {
      private readonly IApplicationDbContext _context;
      private readonly IPasswordHasher _passwordHasher;


      public CreateUserCommandHandler(IApplicationDbContext context, IPasswordHasher passwordHasher)
      {
        _context = context;
        _passwordHasher = passwordHasher;

      }

      public async Task<int> Handle(CreateUserCommand request, CancellationToken cancellationToken)
      {
        var hash = _passwordHasher.Hash(request.Password);
        var user = new User
        {
          Username = request.UserName,
          Password = hash
        };

        var role = await _context.Roles.FindAsync(request.RoleId);

        if (role == null)
        {
          throw new ArgumentException("No such role.");
        }

        var userRole = new UserRole
        {
          User = user,
          Role = role
        };

        _context.Users.Add(user);
        _context.UserRoles.Add(userRole);

        return await _context.SaveChangesAsync(cancellationToken);
      }
    }
  }
}
