namespace Portfolio.Models;

public enum SkillLevel
{
    WorkingWith,
    Learning,
    Exploring
}

public class SkillItem
{
    public string Name { get; set; } = string.Empty;
    public SkillLevel Level { get; set; } = SkillLevel.WorkingWith;
    public string RoleContext { get; set; } = string.Empty;
    public string IconName { get; set; } = string.Empty;

    public string LevelDisplay => Level switch
    {
        SkillLevel.WorkingWith => "Working with",
        SkillLevel.Learning => "Learning",
        SkillLevel.Exploring => "Exploring",
        _ => "Exploring"
    };

    public string LevelBadgeClass => Level switch
    {
        SkillLevel.WorkingWith => "border-lime-400/40 text-lime-300 bg-lime-400/10",
        SkillLevel.Learning => "border-cyan-400/40 text-cyan-300 bg-cyan-400/10",
        SkillLevel.Exploring => "border-slate-500/40 text-slate-300 bg-slate-500/10",
        _ => "border-slate-500/40 text-slate-300 bg-slate-500/10"
    };
}

public class SkillCategory
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public List<SkillItem> Skills { get; set; } = new();
}

public class CodingProfileItem
{
    public string Platform { get; set; } = string.Empty;
    public string Handle { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public string RoleOrFocus { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string IconSvg { get; set; } = string.Empty;
}
