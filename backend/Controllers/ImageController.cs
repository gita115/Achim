using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Data;
using Entities;

[ApiController]
[Route("api/[controller]")]
public class ImagesController : ControllerBase
{
    private readonly AppDbContext _context;

    public ImagesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(string? search, int? categoryId)
    {
        var query = _context.Images.AsQueryable();

        if (!string.IsNullOrEmpty(search))
            query = query.Where(i => i.Title.Contains(search));

        if (categoryId.HasValue)
            query = query.Where(i => i.CategoryId == categoryId);

        return Ok(query);
    }


    [HttpPost]
    public async Task<IActionResult> Create(Image image)
    {
        _context.Images.Add(image);
        await _context.SaveChangesAsync();
        return Ok(image);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Image image)
    {
        var existing = await _context.Images.FindAsync(id);
        if (existing == null) return NotFound();

        _context.Entry(existing).CurrentValues.SetValues(image);
        await _context.SaveChangesAsync();
        return Ok(existing);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var image = await _context.Images.FindAsync(id);
        if (image == null) return NotFound();

        _context.Images.Remove(image);
        await _context.SaveChangesAsync();
        return Ok();
    }
}
