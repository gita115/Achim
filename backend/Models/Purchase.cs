namespace Achim.Models
{
    public class Purchase
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        public int ImageId { get; set; }
        public Image Image { get; set; } = null!;
        public decimal Amount { get; set; }  
        public DateTime PurchaseDate { get; set; }
        public string PaymentStatus { get; set; } = null!;
        public string? PaymentProvider { get; set; }

    }
}
