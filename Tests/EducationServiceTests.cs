using Portfolio.Services;
using Xunit;

namespace Portfolio.Tests;

public class EducationServiceTests
{
    private readonly IEducationService _educationService = new EducationService();

    [Fact]
    public async Task GetEducationRecordAsync_ReturnsVerifiedPstuRecord()
    {
        var record = await _educationService.GetEducationRecordAsync();

        Assert.NotNull(record);
        Assert.Equal("B.Sc. in Engineering, Computer Science and Engineering", record.Degree);
        Assert.Equal("Patuakhali Science and Technology University (PSTU)", record.Institution);
        Assert.Equal("2023–2024", record.AcademicSession);
        Assert.Equal(3.820m, record.CumulativeCgpaThroughThirdSemester);
    }

    [Fact]
    public async Task GetEducationRecordAsync_ContainsThreeProvisionalSemesters()
    {
        var record = await _educationService.GetEducationRecordAsync();

        Assert.Equal(3, record.SemesterResults.Count);

        var sem1 = record.SemesterResults[0];
        Assert.Equal("First Semester", sem1.SemesterName);
        Assert.Equal(3.870m, sem1.SemesterGpa);
        Assert.Equal(3.870m, sem1.CumulativeCgpa);

        var sem2 = record.SemesterResults[1];
        Assert.Equal("Second Semester", sem2.SemesterName);
        Assert.Equal(3.771m, sem2.SemesterGpa);
        Assert.Equal(3.820m, sem2.CumulativeCgpa);

        var sem3 = record.SemesterResults[2];
        Assert.Equal("Third Semester", sem3.SemesterName);
        Assert.Equal(3.821m, sem3.SemesterGpa);
        Assert.Equal(3.820m, sem3.CumulativeCgpa);
    }

    [Fact]
    public async Task GetEducationRecordAsync_ContainsRequiredCourseHighlights()
    {
        var record = await _educationService.GetEducationRecordAsync();

        Assert.Contains("Programming Language", record.HighlightedCourses);
        Assert.Contains("Object-Oriented Programming", record.HighlightedCourses);
        Assert.Contains("Discrete Mathematics", record.HighlightedCourses);
        Assert.Contains("Data Structures and Algorithms", record.HighlightedCourses);
        Assert.Contains("Software Engineering", record.HighlightedCourses);
        Assert.Contains("Mathematics", record.HighlightedCourses);
    }
}
