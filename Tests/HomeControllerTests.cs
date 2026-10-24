using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
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
    private HomeController CreateController(IContactService? contactService = null, bool isAjax = false)
    {
        var projectService = new ProjectService();
        var educationService = new EducationService();
        var skillService = new SkillService();
        var effectiveContactService = contactService ?? new MockContactService();

        var options = Microsoft.Extensions.Options.Options.Create(new PortfolioOptions
        {
            FullName = "Md. Tanvir Anjum",
            Email = "tanviranjum201@gmail.com",
            CanonicalDomain = "https://mtanviranjum.tech"
        });

        var controller = new HomeController(
            projectService,
            educationService,
            skillService,
            effectiveContactService,
            options,
            NullLogger<HomeController>.Instance
        );

        var httpContext = new DefaultHttpContext();
        if (isAjax)
        {
            httpContext.Request.Headers["X-Requested-With"] = "XMLHttpRequest";
        }

        controller.ControllerContext = new ControllerContext { HttpContext = httpContext };
        controller.TempData = new TempDataDictionary(httpContext, new EmptyTempDataProvider());

        return controller;
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

    [Fact]
    public async Task SubmitContact_InvalidModel_Ajax_ReturnsValidationJson()
    {
        var controller = CreateController(isAjax: true);
        controller.ModelState.AddModelError("Name", "Name is required");

        var invalidModel = new ContactFormViewModel();
        var result = await controller.SubmitContact(invalidModel);

        var jsonResult = Assert.IsType<JsonResult>(result);
        Assert.NotNull(jsonResult.Value);

        var successProp = jsonResult.Value.GetType().GetProperty("success");
        Assert.NotNull(successProp);
        Assert.False((bool)successProp.GetValue(jsonResult.Value)!);
    }

    [Fact]
    public async Task SubmitContact_ValidModel_Ajax_ReturnsSuccessJson()
    {
        var controller = CreateController(isAjax: true);

        var validModel = new ContactFormViewModel
        {
            Name = "Alice Visitor",
            Email = "alice@example.com",
            Message = "Valid message body greater than ten characters."
        };

        var result = await controller.SubmitContact(validModel);

        var jsonResult = Assert.IsType<JsonResult>(result);
        Assert.NotNull(jsonResult.Value);

        var successProp = jsonResult.Value.GetType().GetProperty("success");
        Assert.NotNull(successProp);
        Assert.True((bool)successProp.GetValue(jsonResult.Value)!);
    }

    [Fact]
    public async Task SubmitContact_ValidModel_FormPost_RedirectsToContactSection()
    {
        var controller = CreateController(isAjax: false);

        var validModel = new ContactFormViewModel
        {
            Name = "Bob Visitor",
            Email = "bob@example.com",
            Message = "Valid message body greater than ten characters."
        };

        var result = await controller.SubmitContact(validModel);

        var redirect = Assert.IsType<RedirectToActionResult>(result);
        Assert.Equal("Index", redirect.ActionName);
        Assert.Equal("contact", redirect.Fragment);
        Assert.Equal("Message delivered.", controller.TempData["FeedbackMessage"]);
        Assert.Equal(true, controller.TempData["FeedbackSuccess"]);
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

    private class EmptyTempDataProvider : ITempDataProvider
    {
        public IDictionary<string, object> LoadTempData(HttpContext context) => new Dictionary<string, object>();
        public void SaveTempData(HttpContext context, IDictionary<string, object> values) { }
    }
}
