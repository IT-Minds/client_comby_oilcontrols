using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Domain.Entities;
using MediatR;

namespace Application.Users.Commands.CreateUser
{
  public class CreateUserCommand : IRequest<int>
  {
    public string UserName { get; set; }
    public string Password { get; set; }

    public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, int>
    {
      private readonly IApplicationDbContext _context;

      public CreateUserCommandHandler(IApplicationDbContext context)
      {
        _context = context;
      }

      public async Task<int> Handle(CreateUserCommand request, CancellationToken cancellationToken)
      {
        var user = new User
        {
          Username = request.UserName,
          Password = request.Password
        };

        _context.Users.Add(user);
        return await _context.SaveChangesAsync(cancellationToken);
      }
    }
  }
}