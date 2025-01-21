using System.ComponentModel.DataAnnotations;

namespace AuthService.Models
{
    public class User
    {
        public int Id { get; set; }
        [Required]
        public string Username { get; set; }
        [Required]
        public string PasswordHash { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string Role { get; set; }

        public User(string username, string passwordHash, string email, string role)
    {
        Username = username;
        PasswordHash = passwordHash;
        Email = email;
        Role = role;
    }
    }
}

