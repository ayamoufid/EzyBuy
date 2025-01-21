namespace CartService.Models
{
    public class Cart
    {
        public int UserId { get; set; }
        public List<CartItem> Items { get; set; } = new List<CartItem>();
        public decimal TotalAmount { get; set; }
    }
}
