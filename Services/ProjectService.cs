using Portfolio.Models;

namespace Portfolio.Services;

public interface IProjectService
{
    Task<IReadOnlyList<ProjectItem>> GetAllProjectsAsync();
    Task<IReadOnlyList<ProjectItem>> GetFeaturedProjectsAsync();
    Task<ProjectItem?> GetProjectBySlugAsync(string slug);
    Task<IReadOnlyList<string>> GetCategoriesAsync();
    Task<(ProjectItem? Previous, ProjectItem? Next)> GetAdjacentProjectsAsync(string slug);
}

public class ProjectService : IProjectService
{
    private static readonly List<ProjectItem> ProjectsCatalogue = new()
    {
        new ProjectItem
        {
            Slug = "sharesync",
            Title = "ShareSync",
            Tagline = "Academic Share-Market Portfolio Tracker",
            ShortDescription = "A full-stack investment portfolio and stock tracking web application built to explore relational database design, transaction history, and financial calculations.",
            ProblemStatement = "Retail market participants and academic learners often struggle to track multi-transaction equity positions, calculate weighted average buy prices, and reconcile realized vs. unrealized gains across fluctuating market prices.",
            SolutionOverview = "ShareSync provides a clean, responsive interface to log buy/sell transactions, calculate real-time portfolio value, manage holdings, and reconcile profit/loss metrics using an ASP.NET Core backend with a relational MySQL database.",
            Status = "Academic Project (In Active Development)",
            Category = "Full-Stack Web",
            Technologies = new List<string> { "C#", "ASP.NET Core MVC", "MySQL", "Entity Framework Core", "Tailwind CSS", "JavaScript", "HTML5" },
            Contribution = "Designed the relational database schema, implemented core financial calculation algorithms for position averaging, developed MVC controllers, Razor views, and structured the responsive Tailwind CSS user interface.",
            ArchitectureNotes = "Clean separation of concerns with layered MVC architecture. Server-side calculations ensure transactional precision, while EF Core handles parameterized queries to safeguard data integrity.",
            EngineeringDecisions = "Used decimal types throughout for monetary arithmetic to prevent floating-point inaccuracies. Implemented transaction audit logging to maintain full reconciliation history.",
            CurrentLimitations = "Currently relies on mock or batch stock price feeds rather than live low-latency exchange websockets. Designed for academic demonstration and personal portfolio simulation.",
            RepositoryUrl = "https://github.com/MtanvirA/ShareSync", // Verified link or editable placeholder
            LiveDemoUrl = null, // Documented as local/academic prototype
            ImageUrl = "/images/projects/sharesync.svg",
            Featured = true,
            DisplayOrder = 1,
            Highlights = new List<string>
            {
                "Relational MySQL schema modeling portfolios, assets, and buy/sell transaction ledger",
                "Weighted average cost basis calculation and realized/unrealized P&L reconciliation",
                "ASP.NET Core MVC server-rendered architecture with Tailwind styling",
                "Data validation and anti-forgery protection on all transactional forms"
            }
        },
        new ProjectItem
        {
            Slug = "railway-track-health-monitoring",
            Title = "Smart Railway Track Health Monitoring",
            Tagline = "ESP32-Based IoT Track Safety & Signaling Prototype",
            ShortDescription = "An embedded IoT engineering prototype combining sensor telemetry, obstacle detection, train speed calculation, and automated signaling to explore railway safety concepts.",
            ProblemStatement = "Railway track defects, unexpected track obstructions, and misaligned signaling cause severe derailment hazards that require real-time sensing and rapid alert delivery.",
            SolutionOverview = "A hardware and firmware prototype powered by an ESP32 microcontroller that continuously samples ultrasonic obstacle sensors, calculates oncoming speed via transit time, triggers automatic signals, and displays metrics on a local OLED screen and buzzer alert module.",
            Status = "Academic Hardware Prototype / Concept",
            Category = "IoT & Systems",
            Technologies = new List<string> { "C/C++ (Arduino/ESP-IDF)", "ESP32", "Ultrasonic Sensors", "OLED Display", "Buzzer Alert Module", "Hardware Prototyping" },
            Contribution = "Programmed the ESP32 firmware in C/C++, calibrated distance sensor thresholds, implemented speed estimation mathematics, and wired the breadboard circuit prototype with signaling LEDs and audio alarms.",
            ArchitectureNotes = "Event loop architecture running on the ESP32. Non-blocking timing prevents sensor polling delays and keeps the OLED display refreshed and emergency buzzer responsive.",
            EngineeringDecisions = "Implemented debounced sensor readings to filter false positive obstacle alarms caused by environmental vibrations.",
            CurrentLimitations = "Academic bench prototype. Not certified or deployed on commercial or actual operational railway infrastructure.",
            RepositoryUrl = "https://github.com/MtanvirA/Smart-Railway-Track-Monitoring",
            LiveDemoUrl = null,
            ImageUrl = "/images/projects/railway.svg",
            Featured = true,
            DisplayOrder = 2,
            Highlights = new List<string>
            {
                "Real-time obstacle detection using calibrated ultrasonic sensor arrays",
                "Transit-time velocity calculation algorithm for approaching train models",
                "Local telemetry display on 128x64 OLED and audio warning buzzer alerts",
                "Automated track switch and safety signaling logic"
            }
        },
        new ProjectItem
        {
            Slug = "campussync",
            Title = "CampusSync",
            Tagline = "University Scheduling & Department Coordination Prototype",
            ShortDescription = "A centralized academic scheduling and resource coordination platform designed specifically for the PSTU Computer Science and Engineering Department.",
            ProblemStatement = "University departments face communication friction when coordinating class timetables, lab room assignments, exam schedules, and sudden notices across students and faculty members.",
            SolutionOverview = "CampusSync is designed to unify class schedules, lab allocations, faculty consultation hours, and academic announcements into a role-aware web portal for CSE students and faculty.",
            Status = "Department Prototype / In Design Phase",
            Category = "Academic Systems",
            Technologies = new List<string> { "C#", "ASP.NET Core", "MySQL", "Tailwind CSS", "JavaScript" },
            Contribution = "Conducted requirements analysis for PSTU CSE routine distribution, drafted domain entity models (Batches, Courses, Classrooms, Slots), and created initial interface wireframes.",
            ArchitectureNotes = "Domain-driven schedule conflict detection algorithm designed to prevent double-booking of shared computer laboratories and faculty time slots.",
            EngineeringDecisions = "Prioritized mobile-first responsive layout because the vast majority of students access class schedules from smartphones on campus.",
            CurrentLimitations = "Prototype stage. Currently undergoing internal validation; not yet institutionalized across the full PSTU administration.",
            RepositoryUrl = "https://github.com/MtanvirA/CampusSync",
            LiveDemoUrl = null,
            ImageUrl = "/images/projects/campussync.svg",
            Featured = true,
            DisplayOrder = 3,
            Highlights = new List<string>
            {
                "Schedule matrix designed around PSTU CSE semester structure",
                "Conflict detection mechanism for laboratory room occupancy",
                "Mobile-first responsive schedule viewer with zero unnecessary clutter",
                "Centralized notices and room change broadcasts"
            }
        }
    };

    public Task<IReadOnlyList<ProjectItem>> GetAllProjectsAsync()
    {
        return Task.FromResult<IReadOnlyList<ProjectItem>>(
            ProjectsCatalogue.OrderBy(p => p.DisplayOrder).ToList()
        );
    }

    public Task<IReadOnlyList<ProjectItem>> GetFeaturedProjectsAsync()
    {
        return Task.FromResult<IReadOnlyList<ProjectItem>>(
            ProjectsCatalogue.Where(p => p.Featured).OrderBy(p => p.DisplayOrder).ToList()
        );
    }

    public Task<ProjectItem?> GetProjectBySlugAsync(string slug)
    {
        var project = ProjectsCatalogue.FirstOrDefault(p => 
            string.Equals(p.Slug, slug, StringComparison.OrdinalIgnoreCase));
        return Task.FromResult(project);
    }

    public Task<IReadOnlyList<string>> GetCategoriesAsync()
    {
        var categories = ProjectsCatalogue
            .Select(p => p.Category)
            .Distinct()
            .OrderBy(c => c)
            .ToList();
        return Task.FromResult<IReadOnlyList<string>>(categories);
    }

    public Task<(ProjectItem? Previous, ProjectItem? Next)> GetAdjacentProjectsAsync(string slug)
    {
        var list = ProjectsCatalogue.OrderBy(p => p.DisplayOrder).ToList();
        var index = list.FindIndex(p => string.Equals(p.Slug, slug, StringComparison.OrdinalIgnoreCase));
        if (index == -1) return Task.FromResult<(ProjectItem?, ProjectItem?)>((null, null));

        var prev = index > 0 ? list[index - 1] : null;
        var next = index < list.Count - 1 ? list[index + 1] : null;
        return Task.FromResult((prev, next));
    }
}
