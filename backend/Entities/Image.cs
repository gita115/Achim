namespace Entities
{
    public class Image
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public int CategoryId { get; set; }
        public string Photographer { get; set; } = null!;
        public int Year { get; set; }
        public string FilePath { get; set; } = null!;
        public string ThumbnailPath { get; set; } = null!;
        public bool IsActive { get; set; }
        public decimal Price { get; set; }

        public ICollection<ImageTag> ImageTags { get; set; } = new List<ImageTag>();
        public ICollection<Purchase> Purchases { get; set; } = new List<Purchase>();
        public ICollection<DownloadLog> DownloadLogs { get; set; } = new List<DownloadLog>();
    }
}
