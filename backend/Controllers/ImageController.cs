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
    public async Task<IActionResult> Get(
        string? search,
        int? categoryId,
        int? tagId)
    {
        var query = _context.Images
            .Include(i => i.ImageTags)
                .ThenInclude(it => it.Tag)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            search = search.ToLower();

            query = query.Where(i =>
                i.Title.ToLower().Contains(search) ||
                i.Description.ToLower().Contains(search) ||
                i.Photographer.ToLower().Contains(search) ||
                i.ImageTags.Any(t => t.Tag.Name.ToLower().Contains(search))
            );
        }

        if (categoryId.HasValue)
            query = query.Where(i => i.CategoryId == categoryId);

        if (tagId.HasValue)
            query = query.Where(i => i.ImageTags.Any(t => t.TagId == tagId));

        return Ok(await query.ToListAsync());
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
        var existing = await _context.Images
            .Include(i => i.ImageTags)
            .FirstOrDefaultAsync(i => i.Id == id);

        if (existing == null) return NotFound();

        _context.Entry(existing).CurrentValues.SetValues(image);

        existing.ImageTags.Clear();

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

    [HttpPost("upload")]
    public async Task<IActionResult> Upload(
    [FromForm] IFormFile file,
    [FromForm] string title,
    [FromForm] string description,
    [FromForm] int categoryId,
    [FromForm] decimal price,
    [FromForm] string photographer,
    [FromForm] int year,
    [FromForm] bool isActive)
    {
        var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
        var path = Path.Combine("wwwroot/images", fileName);

        using var stream = new FileStream(path, FileMode.Create);
        await file.CopyToAsync(stream);

        var image = new Image
        {
            Title = title,
            Description = description,
            CategoryId = categoryId,
            Price = price,
            Photographer = photographer,
            Year = year,
            IsActive = isActive,
            FilePath = "/images/" + fileName,
            ThumbnailPath = "/images/" + fileName
        };

        _context.Images.Add(image);
        await _context.SaveChangesAsync();

        await _context.SaveChangesAsync();

        return Ok(image);
    }


}
