using Portfolio.Models;
using Portfolio.Options;

namespace Portfolio.ViewModels;

public class ProjectDetailViewModel
{
    public ProjectItem Project { get; set; } = new();
    public ProjectItem? PreviousProject { get; set; }
    public ProjectItem? NextProject { get; set; }
    public PortfolioOptions Options { get; set; } = new();
}
