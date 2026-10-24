using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Portfolio.Models;
using Portfolio.Options;
using Portfolio.Services;
using Portfolio.ViewModels;

namespace Portfolio.Controllers;

public class HomeController : Controller
{
    private readonly IProjectService _projectService;
    private readonly IEducationService _educationService;
    private readonly ISkillService _skillService;
    private readonly IContactService _contactService;
    private readonly PortfolioOptions _portfolioOptions;
    private readonly ILogger<HomeController> _logger;

    public HomeController(
        IProjectService projectService,
        IEducationService educationService,
        ISkillService skillService,
        IContactService contactService,
        IOptions<PortfolioOptions> portfolioOptions,
        ILogger<HomeController> logger)
    {
        _projectService = projectService;
        _educationService = educationService;
        _skillService = skillService;
        _contactService = contactService;
        _portfolioOptions = portfolioOptions.Value;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> Index()
    {
        var vm = await BuildHomeViewModelAsync();

        if (TempData != null && TempData.TryGetValue("FeedbackMessage", out var msgObj) && msgObj is string msg)
        {
            vm.FeedbackMessage = msg;
            vm.FeedbackIsSuccess = TempData["FeedbackSuccess"] as bool? ?? false;
        }

        return View(vm);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> SubmitContact(ContactFormViewModel model)
    {
        var isAjax = Request.Headers["X-Requested-With"] == "XMLHttpRequest" ||
                     Request.Headers.Accept.ToString().Contains("application/json");

        if (!ModelState.IsValid)
        {
            var firstError = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .FirstOrDefault() ?? "Please check the highlighted form errors and try again.";

            if (isAjax)
            {
                return Json(new { success = false, message = firstError, isValidation = true });
            }

            var errorVm = await BuildHomeViewModelAsync();
            errorVm.ContactForm = model;
            errorVm.FeedbackMessage = firstError;
            errorVm.FeedbackIsSuccess = false;
            return View("Index", errorVm);
        }

        var clientIp = HttpContext.Connection.RemoteIpAddress?.ToString();
        var result = await _contactService.SubmitMessageAsync(model, clientIp);

        if (isAjax)
        {
            return Json(new
            {
                success = result.Success,
                message = result.Message,
                isRateLimited = result.IsRateLimited,
                isDatabaseError = result.IsDatabaseError
            });
        }

        TempData["FeedbackMessage"] = result.Message;
        TempData["FeedbackSuccess"] = result.Success;

        return RedirectToAction(nameof(Index), null, "contact");
    }

    [HttpGet]
    public IActionResult TerminalCommand([FromQuery] string? cmd)
    {
        var command = (cmd ?? string.Empty).Trim().ToLowerInvariant();

        var response = command switch
        {
            "help" => new
            {
                type = "help",
                text = "Available commands:\n  about      - Display overview & professional background\n  projects   - List verified featured engineering projects\n  skills     - View categorized technical competencies\n  education  - Show Patuakhali Science and Technology University records\n  links      - Access GitHub, Codeforces, LeetCode, and LinkedIn\n  contact    - Display direct contact channels\n  clear      - Clear the terminal screen\n  exit       - Close this terminal modal"
            },
            "about" => new
            {
                type = "info",
                text = $"Md. Tanvir Anjum\nUndergraduate Computer Science & Engineering student at PSTU.\nAspiring full-stack developer with a passion for algorithms, competitive programming, and building pragmatic web applications."
            },
            "projects" => new
            {
                type = "list",
                text = "Featured Projects:\n1. ShareSync       - Full-stack portfolio & stock tracking web app (ASP.NET Core + MySQL)\n2. Railway Monitor - ESP32 IoT track obstacle & velocity safety prototype\n3. CampusSync      - PSTU CSE department scheduling & coordination portal prototype\nType 'project <name>' or visit /projects for case studies."
            },
            "skills" => new
            {
                type = "list",
                text = "Technical Competencies:\n- Languages: C++, C#, C, JavaScript\n- Backend:   ASP.NET Core MVC, Entity Framework Core\n- Database:  MySQL\n- Frontend:  HTML5, CSS, Tailwind CSS, Vanilla JS\n- Tooling:   Git, GitHub, VS Code"
            },
            "education" => new
            {
                type = "info",
                text = $"Patuakhali Science and Technology University (PSTU)\nDegree: B.Sc. in Engineering, CSE\nSession: 2023–2024\nProvisional Academic Standing:\n- 1st Semester: 3.870 | Cumulative: 3.870\n- 2nd Semester: 3.771 | Cumulative: 3.820\n- 3rd Semester: 3.821 | Cumulative: 3.820\nOverall Cumulative CGPA: 3.820 (Through 3rd Semester)"
            },
            "links" => new
            {
                type = "links",
                text = $"Profiles:\n- GitHub:     {_portfolioOptions.GitHubUrl}\n- Codeforces: {_portfolioOptions.CodeforcesUrl}\n- LeetCode:   {_portfolioOptions.LeetCodeUrl}\n- LinkedIn:   {_portfolioOptions.LinkedInUrl}"
            },
            "contact" => new
            {
                type = "info",
                text = $"Get in touch:\n- Email:    {_portfolioOptions.Email}\n- Domain:   {_portfolioOptions.CanonicalDomain}\n- WhatsApp: Direct button available in the Contact section"
            },
            "clear" => new
            {
                type = "clear",
                text = ""
            },
            "exit" => new
            {
                type = "exit",
                text = "Closing terminal..."
            },
            _ => new
            {
                type = "error",
                text = $"Command not recognized: '{command}'. Type 'help' for a list of available commands."
            }
        };

        return Json(response);
    }

    [HttpGet]
    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult NotFoundPage(int? statusCode)
    {
        ViewBag.StatusCode = statusCode ?? 404;
        return View("NotFound");
    }

    [HttpGet]
    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }

    private async Task<HomeViewModel> BuildHomeViewModelAsync()
    {
        var projects = await _projectService.GetAllProjectsAsync();
        var education = await _educationService.GetEducationRecordAsync();
        var skillCategories = await _skillService.GetSkillCategoriesAsync();
        var codingProfiles = await _skillService.GetCodingProfilesAsync();

        return new HomeViewModel
        {
            Options = _portfolioOptions,
            Projects = projects.ToList(),
            Education = education,
            SkillCategories = skillCategories.ToList(),
            CodingProfiles = codingProfiles.ToList(),
            ContactForm = new ContactFormViewModel()
        };
    }
}
