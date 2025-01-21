using CartService.Models;
using StackExchange.Redis;
using RabbitMQ.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using CartService.Data;
using RabbitMQ.Client;

namespace CartService.Services
{
    public class CartsService : ICartService
    {
        private readonly IConnectionMultiplexer _redis;
        private readonly IModel _channel;
        private readonly ProductDbContext _dbContext;
        private string _cartKey;
        private readonly ILogger<CartsService> _logger;

        public CartsService(IConnectionMultiplexer redis, ProductDbContext dbContext , ILogger<CartsService> logger)
        {
            _redis = redis;
            _dbContext = dbContext;
             _logger = logger;

            var factory = new ConnectionFactory() { HostName = "localhost" };
            var connection = factory.CreateConnection();
            _channel = connection.CreateModel();
        }


        public async Task AddProductToCart(int userId, int productId, int quantity)
        {
            var db = _redis.GetDatabase();
            _cartKey = $"cart:{userId}";

            // Vérification de stock dans la table Products
            var product = await _dbContext.Products.FirstOrDefaultAsync(p => p.Id == productId);
            if (product == null)
            {
                throw new Exception("Le produit n'existe pas.");
            }

            if (product.Quantite < quantity)
            {
                throw new Exception("Le produit n'est pas disponible en stock.");
            }

            // Ajouter le produit au panier
            var cart = await db.HashGetAllAsync(_cartKey);
            var existingProduct = cart.FirstOrDefault(p => p.Name == productId.ToString());

            if (string.IsNullOrEmpty(existingProduct.Value))
            {
                await db.HashSetAsync(_cartKey, productId.ToString(), quantity);
            }
            else
            {
                // Mise à jour de la quantité
                var newQuantity = int.Parse(existingProduct.Value) + quantity;
                if (newQuantity > product.Quantite)
                {
                    throw new Exception("La quantité demandée dépasse le stock disponible.");
                }
                await db.HashSetAsync(_cartKey, productId.ToString(), newQuantity.ToString());
            }
        }

        public async Task UpdateProductQuantity(int userId, int productId, int quantity)
        {
            var db = _redis.GetDatabase();
            _cartKey = $"cart:{userId}";

            var product = await _dbContext.Products.FirstOrDefaultAsync(p => p.Id == productId);
            if (product == null)
            {
                throw new Exception("Le produit n'existe pas.");
            }

            if (product.Quantite < quantity)
            {
                throw new Exception("Le produit n'est pas disponible en stock.");
            }

            var cart = await db.HashGetAllAsync(_cartKey);
            var existingProduct = cart.FirstOrDefault(p => p.Name == productId.ToString());

            if (string.IsNullOrEmpty(existingProduct.Value))
            {
                throw new Exception("Le produit n'existe pas dans le panier.");
            }

            await db.HashSetAsync(_cartKey, productId.ToString(), quantity);
        }

        public async Task RemoveProductFromCart(int userId, int productId)
        {
            var db = _redis.GetDatabase();
            _cartKey = $"cart:{userId}";

            var cart = await db.HashGetAllAsync(_cartKey);
            var existingProduct = cart.FirstOrDefault(p => p.Name == productId.ToString());

            if (string.IsNullOrEmpty(existingProduct.Value))
            {
                throw new Exception("Le produit n'existe pas dans le panier.");
            }

            await db.HashDeleteAsync(_cartKey, productId.ToString());
        }

        public async Task<Cart> GetCart(int userId)
        {
            var db = _redis.GetDatabase();
            _cartKey = $"cart:{userId}";

            // Récupérer les éléments du panier depuis Redis
            var cart = await db.HashGetAllAsync(_cartKey);
            var cartItems = new List<CartItem>();

            foreach (var c in cart)
            {
                var productId = int.Parse(c.Name);
                var quantity = int.Parse(c.Value);

                // Récupérer les informations du produit depuis la base de données
                var product = await _dbContext.Products.FirstOrDefaultAsync(p => p.Id == productId);

                if (product == null)
                {
                    _logger.LogWarning($"Produit avec l'ID {productId} non trouvé.");
                }
                else
                {
                    _logger.LogInformation($"Produit trouvé : {product.Name}, Prix : {product.Price}");
                }

              
                if (product != null)
                {
                    cartItems.Add(new CartItem
                    {
                        ProductId = productId,
                        Quantity = quantity,
                        Price = product.Price 
                    });
                }
            }

            return new Cart { UserId = userId, Items = cartItems };
        }

        public async Task ClearCart(int userId)
        {
            var db = _redis.GetDatabase();
            _cartKey = $"cart:{userId}";

            // Vider le panier
            await db.KeyDeleteAsync(_cartKey);
        }

    }
}
