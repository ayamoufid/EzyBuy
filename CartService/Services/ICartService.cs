using CartService.Models;
using System.Threading.Tasks;
using RabbitMQ.Client;

namespace CartService.Services
{
    public interface ICartService
    {
        Task AddProductToCart(int userId, int productId, int quantity);
        Task UpdateProductQuantity(int userId, int productId, int quantity);
        Task RemoveProductFromCart(int userId, int productId);
        Task<Cart> GetCart(int userId);
        Task ClearCart(int userId);
    }
}
