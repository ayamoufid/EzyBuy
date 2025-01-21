using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using Newtonsoft.Json;
using System.Text;
using OrderService.Models;
using Microsoft.Extensions.DependencyInjection;
using OrderService.Data;

namespace OrderService.Services
{
    public class OrderConsumer
    {
        private readonly IModel _channel;
        private readonly IServiceScopeFactory _scopeFactory;

        public OrderConsumer(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;

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

        public void StartListening()
        {
            var consumer = new EventingBasicConsumer(_channel);

            consumer.Received += async (model, ea) =>
            {
                var body = ea.Body.ToArray();
                var message = Encoding.UTF8.GetString(body);

                Console.WriteLine($"***Message reçu depuis RabbitMQ : {message}***");

                var cartData = JsonConvert.DeserializeObject<CartMessage>(message);

                using (var scope = _scopeFactory.CreateScope())
                {
                    var dbContext = scope.ServiceProvider.GetRequiredService<OrderDbContext>();

                    var order = new Order
                    {
                        UserId = cartData.UserId,
                        OrderDate = DateTime.UtcNow,
                        TotalAmount = cartData.TotalAmount,
                        Items = cartData.Items.Select(item => new OrderItem
                        {
                            ProductId = item.ProductId,
                            Quantity = item.Quantity,
                            Price = item.Price
                        }).ToList()
                    };

                    dbContext.Orders.Add(order);
                    await dbContext.SaveChangesAsync();
                }
            };

            _channel.BasicConsume(queue: "orderQueue",
                                  autoAck: true,
                                  consumer: consumer);
        }
    }

    public class CartMessage
    {
        public int UserId { get; set; }
        public List<CartItemMessage> Items { get; set; }
        public decimal TotalAmount { get; set; }
    }

    public class CartItemMessage
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }
}
