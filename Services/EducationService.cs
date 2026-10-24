using Portfolio.Models;

namespace Portfolio.Services;

public interface IEducationService
{
    Task<EducationRecord> GetEducationRecordAsync();
}

public class EducationService : IEducationService
{
    private static readonly EducationRecord Record = new()
    {
        Degree = "B.Sc. in Engineering, Computer Science and Engineering",
        Institution = "Patuakhali Science and Technology University (PSTU)",
        AcademicSession = "2023–2024",
        CurrentStatus = "Undergraduate Student (Currently completed 3rd Semester)",
        CumulativeCgpaThroughThirdSemester = 3.820m,
        SemesterResults = new List<SemesterResult>
        {
            new SemesterResult
            {
                SemesterName = "First Semester",
                SemesterGpa = 3.870m,
                CumulativeCgpa = 3.870m,
                Remarks = "Strong foundation in fundamental computing, problem-solving, and mathematics."
            },
            new SemesterResult
            {
                SemesterName = "Second Semester",
                SemesterGpa = 3.771m,
                CumulativeCgpa = 3.820m,
                Remarks = "Focused on structured programming, object-oriented concepts, and engineering sciences."
            },
            new SemesterResult
            {
                SemesterName = "Third Semester",
                SemesterGpa = 3.821m,
                CumulativeCgpa = 3.820m,
                Remarks = "Advanced data structures, discrete algorithms, and software engineering principles."
            }
        },
        HighlightedCourses = new List<string>
        {
            "Programming Language",
            "Object-Oriented Programming",
            "Discrete Mathematics",
            "Data Structures and Algorithms",
            "Software Engineering",
            "Mathematics",
            "Electrical and Electronic Engineering Subjects"
        },
        Note = "Academic results reflect official provisional records through the third semester. Degree is currently in progress."
    };

    public Task<EducationRecord> GetEducationRecordAsync()
    {
        return Task.FromResult(Record);
    }
}
