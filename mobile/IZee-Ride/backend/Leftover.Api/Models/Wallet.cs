namespace Leftover.Api.Models;

public class Wallet
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public User? User { get; set; }
    public decimal Balance { get; set; } = 0m;
}
