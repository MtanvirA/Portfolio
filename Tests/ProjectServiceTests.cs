using Portfolio.Services;
using Xunit;

namespace Portfolio.Tests;

public class ProjectServiceTests
{
    private readonly IProjectService _projectService = new ProjectService();

    [Fact]
    public async Task GetAllProjectsAsync_ReturnsExpectedThreeProjects()
    {
        var projects = await _projectService.GetAllProjectsAsync();

        Assert.NotNull(projects);
        Assert.Equal(3, projects.Count);
        Assert.Contains(projects, p => p.Slug == "sharesync");
        Assert.Contains(projects, p => p.Slug == "railway-track-health-monitoring");
        Assert.Contains(projects, p => p.Slug == "campussync");
    }

    [Theory]
    [InlineData("sharesync", "ShareSync")]
    [InlineData("railway-track-health-monitoring", "Smart Railway Track Health Monitoring")]
    [InlineData("campussync", "CampusSync")]
    public async Task GetProjectBySlugAsync_ValidSlug_ReturnsCorrectProject(string slug, string expectedTitle)
    {
        var project = await _projectService.GetProjectBySlugAsync(slug);

        Assert.NotNull(project);
        Assert.Equal(expectedTitle, project.Title);
        Assert.NotEmpty(project.Technologies);
        Assert.False(string.IsNullOrWhiteSpace(project.ProblemStatement));
        Assert.False(string.IsNullOrWhiteSpace(project.SolutionOverview));
    }

    [Fact]
    public async Task GetProjectBySlugAsync_CaseInsensitive_ReturnsProject()
    {
        var project = await _projectService.GetProjectBySlugAsync("ShaReSyNc");

        Assert.NotNull(project);
        Assert.Equal("sharesync", project.Slug);
    }

    [Fact]
    public async Task GetProjectBySlugAsync_InvalidSlug_ReturnsNull()
    {
        var project = await _projectService.GetProjectBySlugAsync("non-existent-project");

        Assert.Null(project);
    }

    [Fact]
    public async Task GetAdjacentProjectsAsync_ReturnsCorrectNeighbors()
    {
        var (prev, next) = await _projectService.GetAdjacentProjectsAsync("sharesync");

        Assert.Null(prev); // First item
        Assert.NotNull(next);
        Assert.Equal("railway-track-health-monitoring", next.Slug);

        var (prev2, next2) = await _projectService.GetAdjacentProjectsAsync("railway-track-health-monitoring");
        Assert.NotNull(prev2);
        Assert.Equal("sharesync", prev2.Slug);
        Assert.NotNull(next2);
        Assert.Equal("campussync", next2.Slug);
    }
}
