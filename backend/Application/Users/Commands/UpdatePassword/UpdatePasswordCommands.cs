using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Security;
using Domain.Entities;
using MediatR;
using Newtonsoft.Json;

namespace Application.Users.Commands.UpdatePassword
{
  [AuthorizeAttribute(Domain.Enums.Action.UPDATE_USER)]
  public class UpdatePasswordCommand : IRequest<int>
  {
    [JsonIgnore]
    public int UserId { get; set; }
    public string Password { get; set; }

    public class UpdatePasswordCommandHandler : IRequestHandler<UpdatePasswordCommand, int>
    {
      private readonly IApplicationDbContext _context;
      private readonly IPasswordHasher _passwordHasher;


      public UpdatePasswordCommandHandler(IApplicationDbContext context, IPasswordHasher passwordHasher)
      {
        _context = context;
        _passwordHasher = passwordHasher;
      }

      public async Task<int> Handle(UpdatePasswordCommand request, CancellationToken cancellationToken)
      {
        var hash = _passwordHasher.Hash(request.Password);
        var user = await _context.Users.FindAsync(request.UserId);

        user.Password = hash;

        _context.Users.Update(user);

        return await _context.SaveChangesAsync(cancellationToken);
      }
    }
  }
}
