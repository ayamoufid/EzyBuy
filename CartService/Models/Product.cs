using System.ComponentModel.DataAnnotations;

namespace CartService.Models
{
    public class Product
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public decimal Price { get; set; }
        [Required]
        public string Category { get; set; }
        [Required]
        public string ImageUrl { get; set; }

        public int Quantite { get; set; }
    }
}
