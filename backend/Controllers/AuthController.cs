using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Data;
using Entities;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;

    public AuthController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] Organization login)
    {
        var org = _context.Organizations
            .FirstOrDefault(o =>
                o.Name == login.Name &&
                o.PasswordHash == login.PasswordHash);

        if (org == null)
            return Unauthorized();

        return Ok(new
        {
            organization = org.Name,
            isAdmin = org.Name == "gitty"
        });
    }
}
