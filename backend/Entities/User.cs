namespace Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public string Role { get; set; } = null!;
        public int OrganizationId { get; set; }
        public Organization Organization { get; set; } = null!;
        public bool Active { get; set; }

        public ICollection<Purchase> Purchases { get; set; } = new List<Purchase>();
        public ICollection<DownloadLog> DownloadLogs { get; set; } = new List<DownloadLog>();
    }
}

