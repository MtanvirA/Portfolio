namespace Portfolio.Models;

public class ProjectItem
{
    public string Slug { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Tagline { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public string ProblemStatement { get; set; } = string.Empty;
    public string SolutionOverview { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public List<string> Technologies { get; set; } = new();
    public string Contribution { get; set; } = string.Empty;
    public string ArchitectureNotes { get; set; } = string.Empty;
    public string EngineeringDecisions { get; set; } = string.Empty;
    public string CurrentLimitations { get; set; } = string.Empty;
    public string? RepositoryUrl { get; set; }
    public string? LiveDemoUrl { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public bool Featured { get; set; }
    public int DisplayOrder { get; set; }
    public List<string> Highlights { get; set; } = new();
}
