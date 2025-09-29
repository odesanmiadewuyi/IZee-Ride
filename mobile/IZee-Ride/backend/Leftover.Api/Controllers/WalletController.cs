using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Leftover.Api.Models;

namespace Leftover.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class WalletController : ControllerBase
{
    private readonly AppDbContext _db;

    public WalletController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var wallet = await _db.Wallets.FindAsync(userId);
        return Ok(new { balance = wallet?.Balance ?? 0 });
    }

    [HttpPost("load-bank-transfer")]
    public async Task<IActionResult> LoadByTransfer([FromBody] LoadDto dto)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var wallet = await _db.Wallets.FindAsync(userId);
        if (wallet == null) return NotFound();

        wallet.Balance += dto.Amount;
        _db.Transactions.Add(new Transaction { UserId = userId, Type = "load", Amount = dto.Amount });
        await _db.SaveChangesAsync();
        return Ok(new { message = "Wallet loaded", balance = wallet.Balance });
    }

    [HttpPost("withdraw")]
    public async Task<IActionResult> Withdraw([FromBody] WithdrawDto dto)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var wallet = await _db.Wallets.FindAsync(userId);
        if (wallet == null || wallet.Balance < dto.Amount) return BadRequest("Insufficient balance");

        wallet.Balance -= dto.Amount;
        _db.Transactions.Add(new Transaction { UserId = userId, Type = "withdraw", Amount = dto.Amount });
        await _db.SaveChangesAsync();
        return Ok(new { message = "Withdrawal successful", balance = wallet.Balance });
    }
}

public record LoadDto(decimal Amount);
public record WithdrawDto(decimal Amount);
