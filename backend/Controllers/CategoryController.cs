using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Data;
using Entities;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly AppDbContext _context;

    public CategoriesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var categories = await _context.Categories
            .Include(c => c.SubCategories)
            .Where(c => c.ParentCategoryId == null)
            .ToListAsync();

        return Ok(categories);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Category category)
    {
        _context.Categories.Add(category);
        await _context.SaveChangesAsync();
        return Ok(category);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Category updated)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null) return NotFound();

        category.Name = updated.Name;
        category.ParentCategoryId = updated.ParentCategoryId;

        await _context.SaveChangesAsync();
        return Ok(category);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id, [FromQuery] string option, [FromQuery] int? newParentId)
    {
        var category = await _context.Categories
            .Include(c => c.SubCategories)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (category == null) return NotFound();

        if (option == "deleteChildren")
        {
            _context.Categories.RemoveRange(category.SubCategories);
        }
        else if (option == "moveToRoot")
        {
            foreach (var child in category.SubCategories)
                child.ParentCategoryId = null;
        }
        else if (option == "moveToOther" && newParentId.HasValue)
        {
            foreach (var child in category.SubCategories)
                child.ParentCategoryId = newParentId;
        }

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();

        return Ok();
    }
}
