using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Leftover.Api.Models;

namespace Leftover.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class TransactionsController : ControllerBase
{
    private readonly AppDbContext _db;

    public TransactionsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpPost("send-leftover")]
    public async Task<IActionResult> SendLeftover([FromBody] SendDto dto)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var wallet = await _db.Wallets.FindAsync(userId);
        if (wallet == null || wallet.Balance < dto.Amount) return BadRequest("Insufficient balance");

        wallet.Balance -= dto.Amount;
        var tx = new Transaction { UserId = userId, Type = "send", Amount = dto.Amount, CauseId = dto.CauseId };
        _db.Transactions.Add(tx);
        await _db.SaveChangesAsync();
        return Ok(tx);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(string id)
    {
        var tx = await _db.Transactions.FindAsync(id);
        if (tx == null) return NotFound();
        return Ok(tx);
    }
}

public record SendDto(string CauseId, decimal Amount);
