using System.Collections.Generic;

namespace Application.Common
{
  public class PageResult<T>
  {
    public int SizeRequested { get; set; }

    public int SkipRequested { get; set; }

    public string SortByRequested { get; set; }

    public IList<T> Results { get; set; }

    public bool HasMore { get; set; } // Not sure if we want this attr as it requires a full DB count at every page request.
  }
}
