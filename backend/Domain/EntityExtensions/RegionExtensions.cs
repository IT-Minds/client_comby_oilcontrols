using System;
using System.Linq;
using Domain.Entities;

namespace Domain.EntityExtensions
{
  public static class RegionExtensions
  {
    private const int NUM_OBSERVATIONS = 5;
    public static double DailyTemperatureEstimate(this Region region, DateTime date)
    {
      var pastTemps = region.DailyTemperatures
        .OrderByDescending(x => x.Date)
        .Where(x => x.Date.Day == date.Day && x.Date.Month == date.Month && x.Date.Year < date.Year)
        .Take(NUM_OBSERVATIONS);
      if (pastTemps.Count() == 0)
      {
        throw new ArgumentException("No temperature entries before: " + date);
      }
      var avgTemp = pastTemps.Average(x => x.Temperature);
      return avgTemp;
    }
  }
}
