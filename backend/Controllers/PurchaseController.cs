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
        foreach (var id in imageIds)
        {
            _context.Purchases.Add(new Purchase
            {
                UserId = 1,
                ImageId = id,
                Amount = 0,
                PurchaseDate = DateTime.UtcNow,
                PaymentStatus = "Completed",
                PaymentProvider = "Demo"
            });
        }

        await _context.SaveChangesAsync();
        return Ok();
    }

}
