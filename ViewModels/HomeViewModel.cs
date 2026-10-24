using Portfolio.Models;
using Portfolio.Options;

namespace Portfolio.ViewModels;

public class HomeViewModel
{
    public PortfolioOptions Options { get; set; } = new();
    public List<ProjectItem> Projects { get; set; } = new();
    public EducationRecord Education { get; set; } = new();
    public List<SkillCategory> SkillCategories { get; set; } = new();
    public List<CodingProfileItem> CodingProfiles { get; set; } = new();
    public ContactFormViewModel ContactForm { get; set; } = new();

    public string? FeedbackMessage { get; set; }
    public bool FeedbackIsSuccess { get; set; }
    public bool HasFeedback => !string.IsNullOrEmpty(FeedbackMessage);
}
