using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Data;
using Entities;

[ApiController]
[Route("api/[controller]")]
public class DownloadsController : ControllerBase
{
    private readonly AppDbContext _context;

    public DownloadsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("{imageId}")]
    public async Task<IActionResult> Download(int imageId)
    {
        var userId = 1;

        var hasPurchase = await _context.Purchases
            .AnyAsync(p => p.UserId == userId
                        && p.ImageId == imageId
                        && p.PaymentStatus == "Completed");

        if (!hasPurchase)
            return Unauthorized();

        var image = await _context.Images.FindAsync(imageId);

        var log = new DownloadLog
        {
            UserId = userId,
            ImageId = imageId,
            DownloadDate = DateTime.Now
        };

        _context.DownloadLogs.Add(log);
        await _context.SaveChangesAsync();

        var path = Path.Combine(Directory.GetCurrentDirectory(), image.FilePath);

        var bytes = await System.IO.File.ReadAllBytesAsync(path);

        return File(bytes, "application/octet-stream", "image.jpg");
    }
}