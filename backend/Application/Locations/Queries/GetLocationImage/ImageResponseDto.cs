namespace Application.Locations.Queries.GetLocationImage
{
  public class ImageResponseDto
  {
    public int LocationId { get; set; }
    public byte[] Stream { get; set; }
  }
}