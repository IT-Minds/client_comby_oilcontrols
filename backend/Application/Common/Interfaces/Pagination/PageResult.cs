using System.Collections.Generic;

namespace Application.Common.Interfaces.Pagination
{
  public class PageResult<T>
  {
    public string NewNeedle { get; set; }
    public int PagesRemaining { get; set; }

    public IList<T> Results { get; set; } = new List<T>();

    public bool HasMore { get; set; }
  }
}
