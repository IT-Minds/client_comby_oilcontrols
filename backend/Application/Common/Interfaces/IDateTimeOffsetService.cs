using System;

namespace Application.Common.Interfaces
{
  public interface IDateTimeOffsetService
  {
    DateTimeOffset Now { get; }
  }
}
