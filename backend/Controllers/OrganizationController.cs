using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Data;
using Entities;

[ApiController]
[Route("api/[controller]")]
public class OrganizationsController : ControllerBase
{
    private readonly AppDbContext _context;

    public OrganizationsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _context.Organizations
            .ToListAsync());
    }

    [HttpPost]
    public async Task<IActionResult> Create(Organization organization)
    {
        _context.Organizations.Add(organization);
        await _context.SaveChangesAsync();
        return Ok(organization);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var org = await _context.Organizations.FindAsync(id);
        if (org == null) return NotFound();

        _context.Organizations.Remove(org);
        await _context.SaveChangesAsync();
        return Ok();
    }


}
