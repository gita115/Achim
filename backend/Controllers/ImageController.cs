using Data;
using Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Drawing.Processing;
using SixLabors.ImageSharp.PixelFormats;


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
    public async Task<IActionResult> Create(Entities.Image image)
    {
        _context.Images.Add(image);
        await _context.SaveChangesAsync();
        return Ok(image);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Entities.Image image)
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
     [FromForm] bool isActive,
     [FromForm] List<int> tagIds)
    {
        if (file == null || file.Length == 0)
            return BadRequest("File is required");

        var categoryExists = await _context.Categories
            .AnyAsync(c => c.Id == categoryId);

        if (!categoryExists)
            return BadRequest("Invalid category");

        var safeTitle = string.Join("_", title.Split(Path.GetInvalidFileNameChars()));
        var extension = Path.GetExtension(file.FileName);
        var fileName = $"{Guid.NewGuid()}_{safeTitle}{extension}";

        var imagesFolder = Path.Combine(
            Directory.GetCurrentDirectory(),
            "wwwroot",
            "images"
        );

        var thumbsFolder = Path.Combine(imagesFolder, "thumbs");

        if (!Directory.Exists(imagesFolder))
            Directory.CreateDirectory(imagesFolder);

        if (!Directory.Exists(thumbsFolder))
            Directory.CreateDirectory(thumbsFolder);

        var fullPath = Path.Combine(imagesFolder, fileName);
        var thumbPath = Path.Combine(thumbsFolder, fileName);

        using (var stream = new FileStream(fullPath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        using (var imageSharp = await SixLabors.ImageSharp.Image.LoadAsync<Rgba32>(fullPath))
        {
            imageSharp.Mutate(x => x.Resize(new ResizeOptions
            {
                Mode = ResizeMode.Max,
                Size = new Size(800, 800)   
            }));

            var watermarkPath = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot",
                "logo.PNG"
            );

            using var watermark = await SixLabors.ImageSharp.Image.LoadAsync<Rgba32>(watermarkPath);

            var watermarkWidth = imageSharp.Width * 0.6;  
            var ratio = watermarkWidth / watermark.Width;
            var watermarkHeight = watermark.Height * ratio;

            watermark.Mutate(x => x.Resize((int)watermarkWidth, (int)watermarkHeight));

            var center = new Point(
                (imageSharp.Width - watermark.Width) / 2,
                (imageSharp.Height - watermark.Height) / 2
            );

            imageSharp.Mutate(ctx =>
            {
                ctx.DrawImage(
                    watermark,
                    center,
                    0.3f
                );
            });


            await imageSharp.SaveAsJpegAsync(thumbPath, new SixLabors.ImageSharp.Formats.Jpeg.JpegEncoder
            {
                Quality = 75
            });
        }




        var image = new Entities.Image
        {
            Title = title,
            Description = description,
            CategoryId = categoryId,
            Price = price,
            Photographer = photographer,
            Year = year,
            IsActive = isActive,
            FilePath = "/images/" + fileName,
            ThumbnailPath = "/images/thumbs/" + fileName
        };

        _context.Images.Add(image);
        await _context.SaveChangesAsync();

        if (tagIds != null && tagIds.Any())
        {
            foreach (var tagId in tagIds)
            {
                _context.ImageTags.Add(new ImageTag
                {
                    ImageId = image.Id,
                    TagId = tagId
                });
            }

            await _context.SaveChangesAsync();
        }

        return Ok(image);
    }
}
