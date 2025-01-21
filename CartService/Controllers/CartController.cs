using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using CartService.Services;
using CartService.Models;


namespace CartService.Controllers
{
    [ApiController]
    [Route("api/cart")]
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;

        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }

        // Ajouter un produit au panier
        [HttpPost("add/{userId}")]
        public async Task<IActionResult> AddProductToCart(int userId, [FromBody] CartItem cartItem)
        {
            try
            {
                await _cartService.AddProductToCart(userId, cartItem.ProductId, cartItem.Quantity);
                return Ok("Produit ajouté au panier");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // Supprimer un produit du panier
        [HttpDelete("remove/{userId}/{productId}")]
        public async Task<IActionResult> RemoveProductFromCart(int userId, int productId)
        {
            try
            {
                await _cartService.RemoveProductFromCart(userId, productId);
                return Ok("Produit supprimé du panier");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // Modifier la quantité d'un produit
        [HttpPut("update/{userId}")]
        public async Task<IActionResult> UpdateProductQuantity(int userId, [FromBody] CartItem cartItem)
        {
            try
            {
                await _cartService.UpdateProductQuantity(userId, cartItem.ProductId, cartItem.Quantity);
                return Ok("Quantité mise à jour");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // Obtenir le panier d'un utilisateur
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetCart(int userId)
        {
            var cart = await _cartService.GetCart(userId);
            return Ok(cart);
        }

        [HttpPost("checkout/{userId}")]
    public async Task<IActionResult> Checkout(int userId)
    {
        try
        {
            var cart = await _cartService.GetCart(userId);

            if (cart == null || !cart.Items.Any())
                return BadRequest("Le panier est vide.");

            // Calcul du montant total du panier
            decimal totalAmount = cart.Items.Sum(item => item.Quantity * item.Price);

            var publisher = new CartPublisher();
            publisher.PublishCart(userId, cart.Items, totalAmount);

            await _cartService.ClearCart(userId);

            return Ok("Panier validé et envoyé à OrderService.");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }



    }
}
