namespace Leftover.Api.Models;

public class Cause
{
    public string Id { get; set; } = Guid.NewGuid().ToString("N");
    public string Title { get; set; } = string.Empty;
    public decimal AmountRequired { get; set; }
    public Guid OwnerId { get; set; }
    public User? Owner { get; set; }
}
