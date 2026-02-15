namespace Entities
{
    public class DownloadLog
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        public int ImageId { get; set; }
        public Image Image { get; set; } = null!;
        public DateTime DownloadDate { get; set; }

    }
}
