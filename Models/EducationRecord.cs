namespace Portfolio.Models;

public class SemesterResult
{
    public string SemesterName { get; set; } = string.Empty;
    public decimal SemesterGpa { get; set; }
    public decimal CumulativeCgpa { get; set; }
    public string Remarks { get; set; } = string.Empty;
}

public class EducationRecord
{
    public string Degree { get; set; } = "B.Sc. in Engineering, Computer Science and Engineering";
    public string Institution { get; set; } = "Patuakhali Science and Technology University (PSTU)";
    public string AcademicSession { get; set; } = "2023–2024";
    public string CurrentStatus { get; set; } = "Undergraduate Student (Completed 3rd Semester)";
    public decimal CumulativeCgpaThroughThirdSemester { get; set; } = 3.820m;
    public List<SemesterResult> SemesterResults { get; set; } = new();
    public List<string> HighlightedCourses { get; set; } = new();
    public string Note { get; set; } = "Provisional university academic records through 3rd semester.";
}
