namespace Application.Common.Interfaces
{
  public interface IAuthorizationService
  {

    bool IsInRole(string role);

    bool HasPolicy(Domain.Enums.Action policy);
  }
}
