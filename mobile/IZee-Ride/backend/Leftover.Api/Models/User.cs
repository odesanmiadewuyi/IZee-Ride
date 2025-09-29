namespace Leftover.Api.Models;

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string FullName { get; set; } = string.Empty;
    public string Country { get; set; } = "NG"; // NG or SE
    public string Phone { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string PasswordHash { get; set; } = string.Empty;
    public string? BVN { get; set; }  // Nigeria
    public string? BankId { get; set; } // Sweden
    public string Role { get; set; } = "user";
    public Wallet? Wallet { get; set; }
}
