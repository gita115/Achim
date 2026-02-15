namespace Entities
{
    public class ImageTag
    {
        public int ImageId { get; set; }
        public int TagId { get; set; }

        public Image Image { get; set; } = null!;
        public Tag Tag { get; set; } = null!;
    }
}
