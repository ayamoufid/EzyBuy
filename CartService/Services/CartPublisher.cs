using RabbitMQ.Client;
using System.Text;
using Newtonsoft.Json;
using CartService.Models;

using CartService.Data; 


namespace CartService.Services
{
    public class CartPublisher
    {
        private readonly IModel _channel;

        public CartPublisher()
        {
            var factory = new ConnectionFactory() { HostName = "localhost" };
            var connection = factory.CreateConnection();
            _channel = connection.CreateModel();

            // Déclarez la file si elle n'existe pas
            _channel.QueueDeclare(queue: "orderQueue",
                                  durable: true,
                                  exclusive: false,
                                  autoDelete: false,
                                  arguments: null);
        }

        public void PublishCart(int userId, List<CartItem> items, decimal totalAmount)
        {
            var cartData = new
            {
                UserId = userId,
                Items = items.Select(item => new
                {
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    Price = item.Price
                }),
                TotalAmount = totalAmount
            };

            var message = JsonConvert.SerializeObject(cartData);
            var body = Encoding.UTF8.GetBytes(message);

            Console.WriteLine($"****Message envoyé à RabbitMQ : {message}***");

            _channel.BasicPublish(exchange: "",
                                  routingKey: "orderQueue",
                                  basicProperties: null,
                                  body: body);
        }
    }
}
