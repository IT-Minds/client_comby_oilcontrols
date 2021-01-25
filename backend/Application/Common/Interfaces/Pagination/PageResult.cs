using System.Collections.Generic;

namespace Application.Common.Interfaces.Pagination
{
  public class PageResult<T, U>
  {
    public U NewNeedle { get; set; }

    public int PagesRemaining { get; set; }

    public IList<T> Results { get; set; } = new List<T>();

    public bool HasMore { get; set; }
  }

  public class PageResult<T> : PageResult<T, string>
  {
    #pragma warning disable 0108
    public string NewNeedle { get; set; }
    #pragma warning restore 0108
  }
}
