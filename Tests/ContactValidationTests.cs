using System.ComponentModel.DataAnnotations;
using Portfolio.ViewModels;
using Xunit;

namespace Portfolio.Tests;

public class ContactValidationTests
{
    private IList<ValidationResult> ValidateModel(object model)
    {
        var validationResults = new List<ValidationResult>();
        var ctx = new ValidationContext(model, null, null);
        Validator.TryValidateObject(model, ctx, validationResults, true);
        return validationResults;
    }

    [Fact]
    public void ValidModel_PassesValidation()
    {
        var model = new ContactFormViewModel
        {
            Name = "Tanvir Test",
            Email = "tanvir@example.com",
            Subject = "Feedback",
            Message = "This is a valid test message with more than 10 characters."
        };

        var errors = ValidateModel(model);

        Assert.Empty(errors);
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public void MissingName_FailsValidation(string invalidName)
    {
        var model = new ContactFormViewModel
        {
            Name = invalidName,
            Email = "valid@example.com",
            Message = "Valid message body here."
        };

        var errors = ValidateModel(model);

        Assert.Contains(errors, e => e.MemberNames.Contains("Name"));
    }

    [Theory]
    [InlineData("not-an-email")]
    [InlineData("missing-at-sign.com")]
    [InlineData("@nodomain.com")]
    [InlineData("user@")]
    public void InvalidEmail_FailsValidation(string invalidEmail)
    {
        var model = new ContactFormViewModel
        {
            Name = "Valid Name",
            Email = invalidEmail,
            Message = "Valid message body here."
        };

        var errors = ValidateModel(model);

        Assert.Contains(errors, e => e.MemberNames.Contains("Email"));
    }

    [Fact]
    public void MessageTooShort_FailsValidation()
    {
        var model = new ContactFormViewModel
        {
            Name = "Valid Name",
            Email = "valid@example.com",
            Message = "Short" // Under 10 characters
        };

        var errors = ValidateModel(model);

        Assert.Contains(errors, e => e.MemberNames.Contains("Message"));
    }

    [Fact]
    public void MessageExceedingMaxLength_FailsValidation()
    {
        var model = new ContactFormViewModel
        {
            Name = "Valid Name",
            Email = "valid@example.com",
            Message = new string('A', 4001) // Exceeds 4000
        };

        var errors = ValidateModel(model);

        Assert.Contains(errors, e => e.MemberNames.Contains("Message"));
    }
}
