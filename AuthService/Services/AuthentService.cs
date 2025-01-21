using AuthService.Models;
using BCrypt.Net;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AuthService.Data;

namespace AuthService.Services
{
    public class AuthentService
    {
        private readonly AuthDbContext _context;
        private readonly string _secretKey;

        public AuthentService(AuthDbContext context,IConfiguration configuration)
        {
            _context = context;
            _secretKey = configuration.GetValue<string>("JwtSettings:SecretKey");
        }

        // Enregistrer un utilisateur
        public async Task<bool> RegisterUserAsync(User user, string password)
        {
            if (await _context.Users.AnyAsync(u => u.Username == user.Username))
                return false;

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(password);
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return true;
        }

        // Authentifier un utilisateur
        public async Task<User?> AuthenticateUserAsync(string username, string password)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
                return null;

            return user;
        }

        // Générer un JWT
        public string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Name, user.Username)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: "yourIssuer", 
                audience: "yourAudience", 
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }


        public async Task<User?> GetUserByTokenAsync(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_secretKey);
            try
            {
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;
                var username = jwtToken.Claims.First(x => x.Type == ClaimTypes.Name).Value;

                return await _context.Users.SingleOrDefaultAsync(u => u.Username == username);
            }
            catch
            {
                return null;
            }
        }

    }
}
