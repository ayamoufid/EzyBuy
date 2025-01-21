using Microsoft.AspNetCore.Mvc;
using ProductService.Models;
using ProductService.Data;
using StackExchange.Redis;

namespace ProductService.Controllers
{
    [Route("api/products")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ProductDbContext _context;
        private readonly IDatabase _redisDb;

        public ProductsController(ProductDbContext context, IConnectionMultiplexer redis)
        {
            _context = context;
            _redisDb = redis.GetDatabase();
        }

        [HttpGet]
        public async Task<IActionResult> GetProducts()
        {
            var cacheKey = "products";
            var cachedProducts = await _redisDb.StringGetAsync(cacheKey);

            if (!string.IsNullOrEmpty(cachedProducts))
            {
                return Ok(System.Text.Json.JsonSerializer.Deserialize<List<Product>>(cachedProducts));
            }

            var products = _context.Products.ToList();
            await _redisDb.StringSetAsync(cacheKey, System.Text.Json.JsonSerializer.Serialize(products), TimeSpan.FromMinutes(10));

            return Ok(products);
        }

        [HttpGet("{id}")]
        public IActionResult GetProduct(int id)
        {
            Console.WriteLine($"Getting product with ID: {id}");
            var product = _context.Products.Find(id);
            if (product == null)
            {
                Console.WriteLine($"Product with ID {id} not found");
                return NotFound();
            }
            return Ok(product);
        }

        [HttpPost]
        public IActionResult CreateProduct(Product product)
        {
            _context.Products.Add(product);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateProduct(int id, Product updatedProduct)
        {
            var product = _context.Products.Find(id);
            if (product == null)
            {
                return NotFound();
            }

            product.Name = updatedProduct.Name;
            product.Description = updatedProduct.Description;
            product.Price = updatedProduct.Price;
            product.Category = updatedProduct.Category;
            product.ImageUrl = updatedProduct.ImageUrl;
            product.Quantite = updatedProduct.Quantite;

            _context.SaveChanges();
            return Ok(product);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteProduct(int id)
        {
            var product = _context.Products.Find(id);
            if (product == null)
            {
                return NotFound();
            }

            _context.Products.Remove(product);
            _context.SaveChanges();
            return NoContent();
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("Aucun fichier sélectionné.");
            }

            var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
            Directory.CreateDirectory(folderPath);

            var filePath = Path.Combine(folderPath, file.FileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var fileUrl = $"{Request.Scheme}://{Request.Host}/images/{file.FileName}";
            return Ok(new { Url = fileUrl });
        }

    }
}
