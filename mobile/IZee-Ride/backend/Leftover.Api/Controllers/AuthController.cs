using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BC = BCrypt.Net.BCrypt;
using Leftover.Api.Models;

namespace Leftover.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IJwtService _jwt;

    public AuthController(AppDbContext db, IJwtService jwt)
    {
        _db = db;
        _jwt = jwt;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        var user = new User
        {
            FullName = dto.FullName,
            Country = dto.Country,
            Phone = dto.Phone,
            Email = dto.Email,
            PasswordHash = BC.HashPassword(dto.Password)
        };
        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        // Create wallet
        var wallet = new Wallet { UserId = user.Id };
        _db.Wallets.Add(wallet);
        await _db.SaveChangesAsync();

        return Ok(new { token = _jwt.GenerateToken(user) });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        User? user = null;
        if (!string.IsNullOrEmpty(dto.BVN))
        {
            user = await _db.Users.FirstOrDefaultAsync(u => u.BVN == dto.BVN);
        }
        else if (!string.IsNullOrEmpty(dto.BankId))
        {
            user = await _db.Users.FirstOrDefaultAsync(u => u.BankId == dto.BankId);
        }
        else if (!string.IsNullOrEmpty(dto.PhoneOrEmail))
        {
            user = await _db.Users.FirstOrDefaultAsync(u => u.Phone == dto.PhoneOrEmail || u.Email == dto.PhoneOrEmail);
            if (user != null && !BC.Verify(dto.Password, user.PasswordHash))
                user = null;
        }

        if (user == null) return Unauthorized("Invalid credentials");

        return Ok(new { token = _jwt.GenerateToken(user) });
    }

    [HttpPost("verify-bvn")]
    public async Task<IActionResult> VerifyBVN([FromBody] BVNDto dto)
    {
        // Mock verification
        var user = await _db.Users.FirstOrDefaultAsync(u => u.BVN == dto.BVN);
        if (user == null)
        {
            user = new User { BVN = dto.BVN, FullName = "Mock User", Country = "NG" };
            _db.Users.Add(user);
            await _db.SaveChangesAsync();
            var wallet = new Wallet { UserId = user.Id };
            _db.Wallets.Add(wallet);
            await _db.SaveChangesAsync();
        }
        return Ok(new { token = _jwt.GenerateToken(user) });
    }

    [HttpPost("verify-bankid")]
    public async Task<IActionResult> VerifyBankId([FromBody] BankIdDto dto)
    {
        // Mock verification
        var user = await _db.Users.FirstOrDefaultAsync(u => u.BankId == dto.BankId);
        if (user == null)
        {
            user = new User { BankId = dto.BankId, FullName = "Mock User", Country = "SE" };
            _db.Users.Add(user);
            await _db.SaveChangesAsync();
            var wallet = new Wallet { UserId = user.Id };
            _db.Wallets.Add(wallet);
            await _db.SaveChangesAsync();
        }
        return Ok(new { token = _jwt.GenerateToken(user) });
    }
}

public record RegisterDto(string FullName, string Country, string Phone, string? Email, string Password);
public record LoginDto(string? PhoneOrEmail, string? Password, string? BVN, string? BankId, string? Country);
public record BVNDto(string BVN);
public record BankIdDto(string BankId);
