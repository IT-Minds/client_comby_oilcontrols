using System;
using System.Threading.Tasks;
using Uniconta.API.Service;
using Uniconta.Common;
using Uniconta.Common.User;
using Uniconta.API.System;
using System.Collections.Generic;
using System.Linq;
using Infrastructure.Options;
using Microsoft.Extensions.Options;
using Application.Common.Interfaces;

namespace Infrastructure.Services
{
  public class UniContaService: IUniContaService
  {
    private UnicontaConnection connection { get; set; }
    private Session session { get; set; }

    private readonly UniContaOptions _options;

    public UniContaService(IOptions<UniContaOptions> options)
    {
      _options = options.Value;
    }
    public async Task<bool> Login()
    {
      connection = new UnicontaConnection(APITarget.Demo);
      session = new Session(connection);
      var loginResult = await session.LoginAsync(_options.ApiUser, _options.ApiPass, LoginType.API, new Guid(_options.ApiGuid));
      if (loginResult != ErrorCodes.Succes) return false;
      return true;
    }


    public async Task<List<UniContaDomain.Entities.UniContaDebtor>> GetDebtors()
    {
      var api = new CrudAPI(session, session.DefaultCompany);

      var debtors = await api.Query<UniContaDomain.Entities.UniContaDebtor>(); // this is it!??

      return debtors.ToList();
    }
  }
}
