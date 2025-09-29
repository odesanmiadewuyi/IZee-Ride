namespace Leftover.Api.Models;

public class Transaction
{
    public string Id { get; set; } = Guid.NewGuid().ToString("N");
    public Guid UserId { get; set; }
    public string Type { get; set; } = "send"; // send | receive | load | withdraw
    public decimal Amount { get; set; } = 0m;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string? CauseId { get; set; }
}
