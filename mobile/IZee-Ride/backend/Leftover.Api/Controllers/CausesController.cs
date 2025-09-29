using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Leftover.Api.Models;

namespace Leftover.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CausesController : ControllerBase
{
    private readonly AppDbContext _db;

    public CausesController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var causes = _db.Causes.ToList();
        return Ok(causes);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CauseDto dto)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var cause = new Cause
        {
            Title = dto.Title,
            AmountRequired = dto.AmountRequired,
            OwnerId = userId
        };
        _db.Causes.Add(cause);
        await _db.SaveChangesAsync();
        return Ok(cause);
    }
}

public record CauseDto(string Title, decimal AmountRequired);
