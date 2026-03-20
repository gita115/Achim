using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Data;
using Entities;

[ApiController]
[Route("api/[controller]")]
public class PurchasesController : ControllerBase
{
    private readonly AppDbContext _context;

    public PurchasesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _context.Purchases
            .Include(p => p.Image)
            .ToListAsync());
    }

    [HttpPost]
    public async Task<IActionResult> Create(Purchase purchase)
    {
        _context.Purchases.Add(purchase);
        await _context.SaveChangesAsync();
        return Ok(purchase);
    }

    [HttpPost("pay")]
    public async Task<IActionResult> Pay(List<int> imageIds)
    {
        var userId = 1;

        foreach (var id in imageIds.Distinct())
        {
            var alreadyExists = await _context.Purchases
                .AnyAsync(p => p.UserId == userId && p.ImageId == id);

            if (alreadyExists) continue;

            var image = await _context.Images.FindAsync(id);
            if (image == null) continue;

            _context.Purchases.Add(new Purchase
            {
                UserId = userId,
                ImageId = id,
                Amount = image.Price,
                PurchaseDate = DateTime.UtcNow,
                PaymentStatus = "Completed",
                PaymentProvider = "Demo"
            });
        }

        await _context.SaveChangesAsync();
        return Ok();
    }
    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var stats = new
        {
            TotalImages = await _context.Images.CountAsync(),
            ActiveImages = await _context.Images.CountAsync(i => i.IsActive),
            TotalPurchases = await _context.Purchases.CountAsync(),
            TotalEarnings = await _context.Purchases.SumAsync(p => p.Amount),
            SalesHistory = await _context.Purchases
                .GroupBy(p => new { p.PurchaseDate.Year, p.PurchaseDate.Month })
                .Select(g => new {
                    Date = $"{g.Key.Month}/{g.Key.Year}",
                    Total = g.Sum(p => p.Amount)
                })
                .Take(6)
                .ToListAsync()
        };
        return Ok(stats);
    }

}
