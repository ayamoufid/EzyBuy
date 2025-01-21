using Microsoft.AspNetCore.Mvc;
using OrderService.Data;
using OrderService.Models;
using Microsoft.EntityFrameworkCore;

namespace OrderService.Controllers
{
    [ApiController]
    [Route("api/orders")]
    public class OrdersController : ControllerBase
    {
        private readonly OrderDbContext _context;

        public OrdersController(OrderDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] Order order)
        {
            if (order == null || order.Items == null || !order.Items.Any())
                return BadRequest("Invalid order data.");

            order.OrderDate = DateTime.UtcNow;
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrder(int id)
        {
            var order = await _context.Orders
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
                return NotFound();

            return Ok(order);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetOrdersByUserId(int userId)
        {
            var orders = await _context.Orders
                .Include(o => o.Items)
                .Where(o => o.UserId == userId)
                .ToListAsync();

            if (orders == null || !orders.Any())
                return NotFound();

            return Ok(orders);
        }
    }
}
