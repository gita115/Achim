namespace Entities
{
    public class Tag
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public ICollection<ImageTag> ImageTags { get; set; } = new List<ImageTag>();
    }
}
