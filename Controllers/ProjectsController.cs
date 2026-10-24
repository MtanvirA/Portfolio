using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Portfolio.Options;
using Portfolio.Services;
using Portfolio.ViewModels;

namespace Portfolio.Controllers;

public class ProjectsController : Controller
{
    private readonly IProjectService _projectService;
    private readonly PortfolioOptions _portfolioOptions;

    public ProjectsController(
        IProjectService projectService,
        IOptions<PortfolioOptions> portfolioOptions)
    {
        _projectService = projectService;
        _portfolioOptions = portfolioOptions.Value;
    }

    [HttpGet]
    public async Task<IActionResult> Index([FromQuery] string? category)
    {
        var allProjects = await _projectService.GetAllProjectsAsync();
        var categories = await _projectService.GetCategoriesAsync();

        ViewBag.SelectedCategory = category;
        ViewBag.Categories = categories;
        ViewBag.Options = _portfolioOptions;

        var filtered = string.IsNullOrWhiteSpace(category) || category.Equals("all", StringComparison.OrdinalIgnoreCase)
            ? allProjects
            : allProjects.Where(p => string.Equals(p.Category, category, StringComparison.OrdinalIgnoreCase)).ToList();

        return View(filtered);
    }

    [HttpGet]
    public async Task<IActionResult> Details(string slug)
    {
        if (string.IsNullOrWhiteSpace(slug))
        {
            return NotFound();
        }

        var project = await _projectService.GetProjectBySlugAsync(slug);
        if (project == null)
        {
            return NotFound();
        }

        var (prev, next) = await _projectService.GetAdjacentProjectsAsync(slug);

        var vm = new ProjectDetailViewModel
        {
            Project = project,
            PreviousProject = prev,
            NextProject = next,
            Options = _portfolioOptions
        };

        return View(vm);
    }
}
