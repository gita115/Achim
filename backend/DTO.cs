public class ImageDto
{
    public int Id { get; set; }
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public int CategoryId { get; set; }
    public string Photographer { get; set; } = null!;
    public int Year { get; set; }
    public string FilePath { get; set; } = null!;
    public string ThumbnailPath { get; set; } = null!;
    public decimal Price { get; set; }
    public bool IsActive { get; set; }
    public List<TagDto> Tags { get; set; } = new List<TagDto>();
}

public class TagDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
}
public class ImageSaveDto
{
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public int CategoryId { get; set; }
    public string Photographer { get; set; } = null!;
    public int Year { get; set; }
    public decimal Price { get; set; }
    public bool IsActive { get; set; }
    public List<int> TagIds { get; set; } = new();
}