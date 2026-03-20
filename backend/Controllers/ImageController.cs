using Data;
using Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.PixelFormats;
using SharpImage = SixLabors.ImageSharp.Image;

[ApiController]
[Route("api/[controller]")]
public class ImagesController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly string _basePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
    public ImagesController(AppDbContext context) => _context = context;

    [HttpGet]
    public async Task<IActionResult> GetImages(string? search,
            int? categoryId,
            string? photographer,
            bool? includeInactive,
            int page = 1,
            int pageSize = 20)
    {
        var query = _context.Images.AsNoTracking();
        if (includeInactive.HasValue && includeInactive==false)
        {
            query = query.Where(i => i.IsActive);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var words = search.ToLower().Split(' ', StringSplitOptions.RemoveEmptyEntries);
            foreach (var word in words)
                query = query.Where(i => EF.Functions.Like(i.Title, $"%{word}%") || i.ImageTags.Any(it => it.Tag.Name.Contains(word)));
        }

        if (categoryId.HasValue) query = query.Where(i => i.CategoryId == categoryId);

        var total = await query.CountAsync();
        var data = await ProjectToDto(query.OrderByDescending(i => i.Id).Skip((page - 1) * pageSize).Take(pageSize)).ToListAsync();

        return Ok(new { data, total, page, pageSize });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var dto = await ProjectToDto(_context.Images.Where(i => i.Id == id)).FirstOrDefaultAsync();
        return dto == null ? NotFound() : Ok(dto);
    }

    [HttpPost("bulk-upload")]
    public async Task<IActionResult> BulkUpload([FromForm] List<IFormFile> files, [FromForm] ImageSaveDto dto)
    {
        if (files == null || !files.Any()) return BadRequest("No files uploaded");

        var newImages = new List<Entities.Image>();
        var thumbsPath = Path.Combine(_basePath, "thumbs");
        if (!Directory.Exists(thumbsPath)) Directory.CreateDirectory(thumbsPath);

        foreach (var file in files)
        {
            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var fullPath = Path.Combine(_basePath, fileName);
            var thumbPath = Path.Combine(thumbsPath, fileName);

            using (var stream = new FileStream(fullPath, FileMode.Create)) await file.CopyToAsync(stream);
            await ProcessThumbnail(fullPath, thumbPath);

            var img = MapToEntity(dto);
            img.FilePath = "/images/" + fileName;
            img.ThumbnailPath = "/images/thumbs/" + fileName;
            img.Title = string.IsNullOrEmpty(dto.Title) ? file.FileName : dto.Title;
            newImages.Add(img);
        }

        _context.Images.AddRange(newImages);
        await _context.SaveChangesAsync();
        return Ok(new { count = newImages.Count });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] ImageSaveDto dto)
    {
        var existing = await _context.Images.Include(i => i.ImageTags).FirstOrDefaultAsync(i => i.Id == id);
        if (existing == null) return NotFound();

        _context.Entry(existing).CurrentValues.SetValues(dto);

        existing.ImageTags.Clear();
        existing.ImageTags = dto.TagIds.Select(tId => new ImageTag { ImageId = id, TagId = tId }).ToList();

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var img = await _context.Images.FindAsync(id);
        if (img == null) return NotFound();
        _context.Images.Remove(img);
        return await _context.SaveChangesAsync() > 0 ? Ok() : BadRequest();
    }

    private IQueryable<ImageDto> ProjectToDto(IQueryable<Entities.Image> query) =>
        query.Select(i => new ImageDto
        {
            Id = i.Id,
            Title = i.Title,
            Description = i.Description,
            CategoryId = i.CategoryId,
            Photographer = i.Photographer,
            Year = i.Year,
            FilePath = i.FilePath,
            ThumbnailPath = i.ThumbnailPath,
            Price = i.Price,
            IsActive = i.IsActive,
            Tags = i.ImageTags.Select(it => new TagDto { Id = it.Tag.Id, Name = it.Tag.Name }).ToList()
        });

    private Entities.Image MapToEntity(ImageSaveDto dto) => new()
    {
        Title = dto.Title,
        Description = dto.Description,
        CategoryId = dto.CategoryId,
        Photographer = dto.Photographer,
        Year = dto.Year,
        Price = dto.Price,
        IsActive = dto.IsActive,
        ImageTags = dto.TagIds.Select(id => new ImageTag { TagId = id }).ToList()
    };

    private async Task ProcessThumbnail(string src, string dest)
    {
        using var img = await SharpImage.LoadAsync<Rgba32>(src);
        img.Mutate(x => x.Resize(new ResizeOptions { Mode = ResizeMode.Max, Size = new Size(800, 800) }));
        float luminance = 0;
        img.ProcessPixelRows(accessor => {
            for (int y = 0; y < accessor.Height; y++)
            {
                var row = accessor.GetRowSpan(y);
                foreach (var pixel in row)
                {
                    luminance += (0.2126f * pixel.R + 0.7152f * pixel.G + 0.0722f * pixel.B);
                }
            }
        });
        float avgLuminance = luminance / (img.Width * img.Height);
        string logoFileName = avgLuminance > 128 ? "blackLogo.png" : "whiteLogo.png";
        var logoPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", logoFileName);
        if (System.IO.File.Exists(logoPath))
        {
            using var logo = await SharpImage.LoadAsync(logoPath);
            var watermarkWidth = img.Width * 0.5;
            var ratio = watermarkWidth / logo.Width;
            var watermarkHeight = logo.Height * ratio;

            using var resizedWatermark = logo.Clone(x => x.Resize((int)watermarkWidth, (int)watermarkHeight));

            // מיקום במרכז
            var center = new Point(
                (img.Width - resizedWatermark.Width) / 2,
                (img.Height - resizedWatermark.Height) / 2
            );

            // ציור סימן המים עם שקיפות
            img.Mutate(ctx => ctx.DrawImage(resizedWatermark, center, 0.4f));
            //float ratio = (float)(img.Width * 0.45) / logo.Width;
            //logo.Mutate(x => x.Resize((int)(logo.Width * ratio), (int)(logo.Height * ratio)));
            //var location = new Point(img.Width - logo.Width , img.Height - logo.Height );
            //img.Mutate(x => x.DrawImage(logo, location, 0.5f)); 
        }

        await img.SaveAsJpegAsync(dest, new SixLabors.ImageSharp.Formats.Jpeg.JpegEncoder { Quality = 85 });
    }
































    //    public ImagesController(AppDbContext context)
    //    {
    //        _context = context;
    //    }

    //    #region Private Helper Methods (The "Engine")

    //    // 1. ריכוז ההמרה ל-DTO כדי למנוע כפילויות בכל ה-Getters
    //    private IQueryable<ImageDto> MapToDto(IQueryable<Entities.Image> query)
    //    {
    //        return query.Select(i => new ImageDto
    //        {
    //            Id = i.Id,
    //            Title = i.Title,
    //            Description = i.Description,
    //            CategoryId = i.CategoryId,
    //            Photographer = i.Photographer,
    //            Year = i.Year,
    //            FilePath = i.FilePath,
    //            ThumbnailPath = i.ThumbnailPath,
    //            Price = i.Price,
    //            IsActive = i.IsActive,
    //            Tags = i.ImageTags.Select(t => new TagDto { Id = t.Tag.Id, Name = t.Tag.Name }).ToList()
    //        });
    //    }

    //    // 2. לוגיקה אחת ויחידה ליצירת Thumbnail עם סימן מים - משמשת גם ב-Upload וגם ב-Refresh
    //    private async Task CreateThumbnailWithWatermarkAsync(string sourcePath, string destPath, string watermarkFileName)
    //    {
    //        var watermarkPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", watermarkFileName);

    //        if (!System.IO.File.Exists(watermarkPath))
    //            throw new FileNotFoundException($"Watermark file {watermarkFileName} not found in wwwroot");

    //        using var image = await SixLabors.ImageSharp.Image.LoadAsync<Rgba32>(sourcePath);
    //        using var watermark = await SixLabors.ImageSharp.Image.LoadAsync<Rgba32>(watermarkPath);

    //        // שינוי גודל תמונה ל-Thumbnail
    //        image.Mutate(x => x.Resize(new ResizeOptions
    //        {
    //            Mode = ResizeMode.Max,
    //            Size = new Size(800, 800)
    //        }));

    //        // חישוב גודל לוגו (למשל 50% מרוחב התמונה)
    //        var watermarkWidth = image.Width * 0.5;
    //        var ratio = watermarkWidth / watermark.Width;
    //        var watermarkHeight = watermark.Height * ratio;

    //        using var resizedWatermark = watermark.Clone(x => x.Resize((int)watermarkWidth, (int)watermarkHeight));

    //        // מיקום במרכז
    //        var center = new Point(
    //            (image.Width - resizedWatermark.Width) / 2,
    //            (image.Height - resizedWatermark.Height) / 2
    //        );

    //        // ציור סימן המים עם שקיפות
    //        image.Mutate(ctx => ctx.DrawImage(resizedWatermark, center, 0.3f));

    //        // שמירה כ-JPEG
    //        await image.SaveAsJpegAsync(destPath, new SixLabors.ImageSharp.Formats.Jpeg.JpegEncoder { Quality = 75 });
    //    }

    //    #endregion

    //    #region Read Operations (Getters)

    //    [HttpGet]
    //    public async Task<IActionResult> GetImages(
    //        string? search,
    //        int? categoryId,
    //        string? photographer,
    //        int page = 1,
    //        int pageSize = 20)
    //    {
    //        var query = _context.Images
    //            .Include(i => i.ImageTags).ThenInclude(it => it.Tag)
    //            //.Where(i => i.IsActive)
    //            .AsQueryable();

    //        if (!string.IsNullOrWhiteSpace(search))
    //        {
    //            var words = search.ToLower().Split(' ', StringSplitOptions.RemoveEmptyEntries);
    //            foreach (var word in words)
    //            {
    //                query = query.Where(i =>
    //                    i.Title.ToLower().Contains(word) ||
    //                    i.Description.ToLower().Contains(word) ||
    //                    i.Photographer.ToLower().Contains(word) ||
    //                    i.ImageTags.Any(t => t.Tag.Name.ToLower().Contains(word))
    //                );
    //            }
    //        }

    //        if (categoryId.HasValue) query = query.Where(i => i.CategoryId == categoryId.Value);
    //        if (!string.IsNullOrEmpty(photographer)) query = query.Where(i => i.Photographer == photographer);

    //        var total = await query.CountAsync();
    //        var data = await MapToDto(query.OrderBy(i => i.Id).Skip((page - 1) * pageSize).Take(pageSize)).ToListAsync();

    //        return Ok(new { data, total, page, pageSize });
    //    }

    //    [HttpGet("{id}")]
    //    public async Task<IActionResult> GetById(int id)
    //    {
    //        var dto = await MapToDto(_context.Images.Where(i => i.Id == id)).FirstOrDefaultAsync();
    //        return dto == null ? NotFound() : Ok(dto);
    //    }

    [HttpGet("photographers")]
    public async Task<IActionResult> GetPhotographers()
    {
        var photographers = await _context.Images
            //.Where(i => i.IsActive)
            .Select(i => i.Photographer)
            .Distinct()
            .OrderBy(p => p)
            .ToListAsync();
        return Ok(photographers);
    }

    //    #endregion

    //    #region Write Operations (CUD)

    //    [HttpPost("upload")]
    //    public async Task<IActionResult> Upload(
    //        [FromForm] IFormFile file,
    //        [FromForm] string title,
    //        [FromForm] string description,
    //        [FromForm] int categoryId,
    //        [FromForm] decimal price,
    //        [FromForm] string photographer,
    //        [FromForm] int year,
    //        [FromForm] bool isActive,
    //        [FromForm] List<int> tagIds)
    //    {
    //        if (file == null || file.Length == 0) return BadRequest("File is required");

    //        // יצירת שמות קבצים ותיקיות
    //        var safeTitle = string.Join("_", title.Split(Path.GetInvalidFileNameChars()));
    //        var fileName = $"{Guid.NewGuid()}_{safeTitle}{Path.GetExtension(file.FileName)}";
    //        var imagesFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
    //        var thumbsFolder = Path.Combine(imagesFolder, "thumbs");

    //        if (!Directory.Exists(thumbsFolder)) Directory.CreateDirectory(thumbsFolder);

    //        var fullPath = Path.Combine(imagesFolder, fileName);
    //        var thumbPath = Path.Combine(thumbsFolder, fileName);

    //        // 1. שמירת מקור
    //        using (var stream = new FileStream(fullPath, FileMode.Create))
    //        {
    //            await file.CopyToAsync(stream);
    //        }

    //        // 2. יצירת Thumbnail (שימוש במתודה המאוחדת)
    //        await CreateThumbnailWithWatermarkAsync(fullPath, thumbPath, "whiteLogo.PNG");

    //        // 3. שמירה ל-DB
    //        var image = new Entities.Image
    //        {
    //            Title = title,
    //            Description = description,
    //            CategoryId = categoryId,
    //            Price = price,
    //            Photographer = photographer,
    //            Year = year,
    //            IsActive = isActive,
    //            FilePath = "/images/" + fileName,
    //            ThumbnailPath = "/images/thumbs/" + fileName
    //        };

    //        _context.Images.Add(image);
    //        await _context.SaveChangesAsync();

    //        if (tagIds?.Any() == true)
    //        {
    //            foreach (var tagId in tagIds)
    //            {
    //                _context.ImageTags.Add(new ImageTag { ImageId = image.Id, TagId = tagId });
    //            }
    //            await _context.SaveChangesAsync();
    //        }

    //        return Ok(image);
    //    }

    //    [HttpPut("{id}")]
    //    public async Task<IActionResult> Update(int id, ImageDto dto)
    //    {
    //        var existing = await _context.Images.Include(i => i.ImageTags).FirstOrDefaultAsync(i => i.Id == id);
    //        if (existing == null) return NotFound();

    //        existing.Title = dto.Title;
    //        existing.Description = dto.Description;
    //        existing.Price = dto.Price;
    //        existing.CategoryId = dto.CategoryId;
    //        //existing.ImageTags = dto.TagIds;

    //        //existing.ImageTags.Clear();
    //        //if (dto.TagIds?.Any() == true)
    //        //{
    //        //    foreach (var tagId in dto.TagIds)
    //        //        existing.ImageTags.Add(new ImageTag { ImageId = id, TagId = tagId });
    //        //}

    //        await _context.SaveChangesAsync();
    //        return Ok(existing);
    //    }

    //    [HttpDelete("{id}")]
    //    public async Task<IActionResult> Delete(int id)
    //    {
    //        var image = await _context.Images.FindAsync(id);
    //        if (image == null) return NotFound();
    //        _context.Images.Remove(image);
    //        await _context.SaveChangesAsync();
    //        return Ok();
    //    }

    //    #endregion

    //    #region Admin Tools

    //    [HttpPost("refresh-thumbnails")]
    //    public async Task<IActionResult> RefreshThumbnails([FromQuery] string logoName = "whiteLogo.PNG")
    //    {
    //        var images = await _context.Images.ToListAsync();
    //        int successCount = 0;

    //        foreach (var img in images)
    //        {
    //            var fullPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", img.FilePath.TrimStart('/'));
    //            var thumbPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", img.ThumbnailPath.TrimStart('/'));

    //            if (!System.IO.File.Exists(fullPath)) continue;

    //            try
    //            {
    //                await CreateThumbnailWithWatermarkAsync(fullPath, thumbPath, logoName);
    //                successCount++;
    //            }
    //            catch (Exception ex)
    //            {
    //                // כאן אפשר להוסיף לוג של השגיאה אם רוצים
    //            }
    //        }

    //        return Ok($"עודכנו בהצלחה {successCount} תמונות באמצעות הלוגו: {logoName}");
    //    }

    //    #endregion
}
