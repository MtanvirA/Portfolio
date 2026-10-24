namespace Portfolio.Options;

public class PortfolioOptions
{
    public const string SectionName = "Portfolio";

    public string CanonicalDomain { get; set; } = "https://mtanviranjum.tech";
    public string FullName { get; set; } = "Md. Tanvir Anjum";
    public string RoleTitle { get; set; } = "Aspiring Full-Stack Developer & Competitive Programmer";
    public string Email { get; set; } = "tanviranjum201@gmail.com";
    
    // Centralized WhatsApp configuration
    public string WhatsAppNumber { get; set; } = "+8801718659824";
    
    public string GitHubUrl { get; set; } = "https://github.com/MtanvirA";
    public string LinkedInUrl { get; set; } = "https://www.linkedin.com/in/md-tanvir-anjum-3642371aa/";
    public string CodeforcesUrl { get; set; } = "https://codeforces.com/profile/MtanvirA";
    public string LeetCodeUrl { get; set; } = "https://leetcode.com/u/MtanvirA/";
    public string FacebookUrl { get; set; } = "https://www.facebook.com/mtanvira.uo/";
    
    public string Institution { get; set; } = "Patuakhali Science and Technology University (PSTU)";
    public string Degree { get; set; } = "B.Sc. in Engineering, Computer Science and Engineering";
    public string AcademicSession { get; set; } = "2023–2024";
    public decimal CumulativeCgpa { get; set; } = 3.820m;

    /// <summary>
    /// Generates a direct WhatsApp link with pre-filled message without exposing the phone number as visible text.
    /// </summary>
    public string GetWhatsAppUrl(string message = "Hi Tanvir, I saw your portfolio and would like to connect!")
    {
        var sanitized = new string(WhatsAppNumber.Where(char.IsDigit).ToArray());
        return $"https://wa.me/{sanitized}?text={Uri.EscapeDataString(message)}";
    }
}
