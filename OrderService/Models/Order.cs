namespace OrderService.Models
{
    public class Order
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public DateTime OrderDate { get; set; }
        public List<OrderItem> Items { get; set; }
        public decimal TotalAmount { get; set; }
    }
}