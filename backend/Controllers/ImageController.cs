using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Data;
using Domain.Entities;

namespace Achim.Controllers
{
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
        public async Task<IActionResult> GetAll()
        {
            var images = await _context.Images
                .Include(i => i.Category)
                .ToListAsync();

            return Ok(images);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Image image)
        {
            _context.Images.Add(image);
            await _context.SaveChangesAsync();

            return Ok(image);
        }
    }
}
