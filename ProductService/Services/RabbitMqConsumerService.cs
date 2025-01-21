using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System;
using System.Text;

namespace ProductService.Services
{/*
    public class RabbitMqConsumerService
    {
        private readonly string _hostName = "localhost";
        private readonly string _queueName = "cart_queue";

        public void StartListening()
        {
            var factory = new ConnectionFactory() { HostName = _hostName };
            using (var connection = factory.CreateConnection())
            using (var channel = connection.CreateModel())
            {
                channel.QueueDeclare(queue: _queueName,
                                     durable: false,
                                     exclusive: false,
                                     autoDelete: false,
                                     arguments: null);

                var consumer = new EventingBasicConsumer(channel);
                consumer.Received += (model, ea) =>
                {
                    var message = Encoding.UTF8.GetString(ea.Body.ToArray());
                    Console.WriteLine($"[x] Received {message}");

                    // Traiter le message 
                };

                channel.BasicConsume(queue: _queueName,
                                     autoAck: true,
                                     consumer: consumer);

                Console.WriteLine(" [*] Waiting for messages. To exit press [CTRL+C]");
            }
        }
    }*/
}
