using AuthService.Models;
using AuthService.Services;
using Microsoft.AspNetCore.Mvc;

namespace AuthService.Controllers
{
    public class LoginRequest
    {
        public string username { get; set; }
        public string password { get; set; }
    }
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AuthentService _authService;

        public AuthController(AuthentService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            if (string.IsNullOrEmpty(user.PasswordHash))
            {
                return BadRequest("Password is required.");
            }
            var result = await _authService.RegisterUserAsync(user, user.PasswordHash);
            if (!result) return BadRequest("Username already exists");

            return Ok("Registration successful");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
        {
            var user = await _authService.AuthenticateUserAsync(loginRequest.username, loginRequest.password);
            if (user == null) return Unauthorized();

            var token = _authService.GenerateJwtToken(user);
            return Ok(new { Token = token, userId = user.Id, role = user.Role });
        }

        [HttpGet("user")]
        public async Task<IActionResult> GetUser([FromHeader] string Authorization)
        {
            if (string.IsNullOrEmpty(Authorization) || !Authorization.StartsWith("Bearer "))
                return Unauthorized(new { message = "Invalid token" });

            var token = Authorization.Substring("Bearer ".Length).Trim();
            var user = await _authService.GetUserByTokenAsync(token);

            if (user == null)
                return Unauthorized(new { message = "Invalid token" });

            return Ok(new { user_id = user.Id, username = user.Username ,role = user.Role });
        }

    }
}
