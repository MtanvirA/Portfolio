using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using Portfolio.Controllers;
using Portfolio.Options;
using Portfolio.Services;
using Portfolio.ViewModels;
using Xunit;

namespace Portfolio.Tests;

public class HomeControllerTests
{
    private HomeController CreateController()
    {
        var projectService = new ProjectService();
        var educationService = new EducationService();
        var skillService = new SkillService();
        var rateLimitService = new MemoryRateLimitService();
        
        // Mock contact service that returns success
        var mockContactService = new MockContactService();

        var options = Microsoft.Extensions.Options.Options.Create(new PortfolioOptions
        {
            FullName = "Md. Tanvir Anjum",
            Email = "tanviranjum201@gmail.com",
            CanonicalDomain = "https://mtanviranjum.tech"
        });

        return new HomeController(
            projectService,
            educationService,
            skillService,
            mockContactService,
            options,
            NullLogger<HomeController>.Instance
        );
    }

    [Fact]
    public async Task Index_ReturnsViewResultWithHomeViewModel()
    {
        var controller = CreateController();

        var result = await controller.Index();

        var viewResult = Assert.IsType<ViewResult>(result);
        var model = Assert.IsType<HomeViewModel>(viewResult.Model);

        Assert.NotNull(model.Projects);
        Assert.Equal(3, model.Projects.Count);
        Assert.NotNull(model.Education);
        Assert.Equal(3.820m, model.Education.CumulativeCgpaThroughThirdSemester);
        Assert.NotEmpty(model.SkillCategories);
        Assert.NotEmpty(model.CodingProfiles);
    }

    [Theory]
    [InlineData("help", "help")]
    [InlineData("about", "info")]
    [InlineData("projects", "list")]
    [InlineData("skills", "list")]
    [InlineData("education", "info")]
    [InlineData("links", "links")]
    [InlineData("contact", "info")]
    [InlineData("clear", "clear")]
    [InlineData("exit", "exit")]
    [InlineData("unknown_command", "error")]
    public void TerminalCommand_ReturnsAppropriatePayload(string cmd, string expectedType)
    {
        var controller = CreateController();

        var result = controller.TerminalCommand(cmd);

        var jsonResult = Assert.IsType<JsonResult>(result);
        Assert.NotNull(jsonResult.Value);

        var typeProp = jsonResult.Value.GetType().GetProperty("type");
        Assert.NotNull(typeProp);
        var typeVal = typeProp.GetValue(jsonResult.Value)?.ToString();

        Assert.Equal(expectedType, typeVal);
    }

    private class MockContactService : IContactService
    {
        public Task<ContactSubmissionResult> SubmitMessageAsync(ContactFormViewModel model, string? clientIp)
        {
            return Task.FromResult(new ContactSubmissionResult
            {
                Success = true,
                Message = "Message delivered."
            });
        }
    }
}
