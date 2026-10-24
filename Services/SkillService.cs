using Portfolio.Models;

namespace Portfolio.Services;

public interface ISkillService
{
    Task<IReadOnlyList<SkillCategory>> GetSkillCategoriesAsync();
    Task<IReadOnlyList<CodingProfileItem>> GetCodingProfilesAsync();
}

public class SkillService : ISkillService
{
    private static readonly List<SkillCategory> Categories = new()
    {
        new SkillCategory
        {
            Title = "Programming & Problem Solving",
            Description = "Core procedural and object-oriented languages used for competitive programming, algorithms, and backend systems.",
            Skills = new List<SkillItem>
            {
                new SkillItem
                {
                    Name = "C",
                    Level = SkillLevel.WorkingWith,
                    RoleContext = "Procedural systems foundations, memory management concepts, and initial academic computing.",
                    IconName = "c"
                },
                new SkillItem
                {
                    Name = "C++",
                    Level = SkillLevel.WorkingWith,
                    RoleContext = "Primary language for competitive programming, STL data structures, and algorithmic problem-solving on Codeforces/LeetCode.",
                    IconName = "cpp"
                },
                new SkillItem
                {
                    Name = "JavaScript",
                    Level = SkillLevel.WorkingWith,
                    RoleContext = "Client-side browser interactivity, DOM manipulation, asynchronous fetch requests, and accessible UI behavior.",
                    IconName = "javascript"
                },
                new SkillItem
                {
                    Name = "C#",
                    Level = SkillLevel.WorkingWith,
                    RoleContext = "Server-side enterprise application architecture, object-oriented design, LINQ, and backend business logic.",
                    IconName = "csharp"
                }
            }
        },
        new SkillCategory
        {
            Title = "Web Development",
            Description = "Full-stack frameworks and layout engines for engineering responsive, accessible web applications.",
            Skills = new List<SkillItem>
            {
                new SkillItem
                {
                    Name = "ASP.NET Core MVC",
                    Level = SkillLevel.WorkingWith,
                    RoleContext = "Server-rendered architecture, controllers, Razor views, dependency injection, and model validation.",
                    IconName = "aspnet"
                },
                new SkillItem
                {
                    Name = "HTML5",
                    Level = SkillLevel.WorkingWith,
                    RoleContext = "Semantic document structure, landmark elements, native dialogs, and web accessibility standards.",
                    IconName = "html"
                },
                new SkillItem
                {
                    Name = "CSS / Tailwind CSS",
                    Level = SkillLevel.WorkingWith,
                    RoleContext = "Modern layout systems (Flexbox, CSS Grid), compiled Tailwind CSS pipelines, design tokens, and responsive breakpoints.",
                    IconName = "tailwind"
                },
                new SkillItem
                {
                    Name = "Bootstrap",
                    Level = SkillLevel.Learning,
                    RoleContext = "Component grids, responsive utility classes, and prototyping administrative and rapid interface layouts.",
                    IconName = "bootstrap"
                }
            }
        },
        new SkillCategory
        {
            Title = "Database & Development Tools",
            Description = "Data persistence layers, version control workflows, and developer productivity tooling.",
            Skills = new List<SkillItem>
            {
                new SkillItem
                {
                    Name = "MySQL",
                    Level = SkillLevel.WorkingWith,
                    RoleContext = "Relational schema design, normalization, foreign key constraints, indexes, and EF Core migrations.",
                    IconName = "mysql"
                },
                new SkillItem
                {
                    Name = "Git & GitHub",
                    Level = SkillLevel.WorkingWith,
                    RoleContext = "Version control, feature branching, clean commit histories, remote synchronization, and repository maintenance.",
                    IconName = "git"
                },
                new SkillItem
                {
                    Name = "VS Code",
                    Level = SkillLevel.WorkingWith,
                    RoleContext = "Primary code editing environment, debugging workflows, extensions, and integrated terminal tasks.",
                    IconName = "vscode"
                }
            }
        }
    };

    private static readonly List<CodingProfileItem> Profiles = new()
    {
        new CodingProfileItem
        {
            Platform = "GitHub",
            Handle = "@MtanvirA",
            Url = "https://github.com/MtanvirA",
            RoleOrFocus = "Open Source & Web Repositories",
            Description = "Home to full-stack projects, C#/ASP.NET Core source code, and university technical explorations.",
            IconSvg = "github"
        },
        new CodingProfileItem
        {
            Platform = "Codeforces",
            Handle = "MtanvirA",
            Url = "https://codeforces.com/profile/MtanvirA",
            RoleOrFocus = "Competitive Programming",
            Description = "Regular participant in algorithmic contests, practicing data structures, dynamic programming, and math under time pressure.",
            IconSvg = "codeforces"
        },
        new CodingProfileItem
        {
            Platform = "LeetCode",
            Handle = "MtanvirA",
            Url = "https://leetcode.com/u/MtanvirA/",
            RoleOrFocus = "Algorithms & Data Structures",
            Description = "Focused problem-solving practice covering trees, graphs, sorting algorithms, and system design fundamentals.",
            IconSvg = "leetcode"
        },
        new CodingProfileItem
        {
            Platform = "LinkedIn",
            Handle = "md-tanvir-anjum",
            Url = "https://www.linkedin.com/in/md-tanvir-anjum-3642371aa/",
            RoleOrFocus = "Professional Network",
            Description = "Connecting with fellow engineers, academic peers, and technology communities.",
            IconSvg = "linkedin"
        }
    };

    public Task<IReadOnlyList<SkillCategory>> GetSkillCategoriesAsync()
    {
        return Task.FromResult<IReadOnlyList<SkillCategory>>(Categories);
    }

    public Task<IReadOnlyList<CodingProfileItem>> GetCodingProfilesAsync()
    {
        return Task.FromResult<IReadOnlyList<CodingProfileItem>>(Profiles);
    }
}
