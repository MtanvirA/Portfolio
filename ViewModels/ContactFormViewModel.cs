using System.ComponentModel.DataAnnotations;

namespace Portfolio.ViewModels;

public class ContactFormViewModel
{
    [Required(ErrorMessage = "Please enter your name.")]
    [StringLength(100, ErrorMessage = "Name cannot exceed 100 characters.")]
    [Display(Name = "Your Name")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Please enter your email address.")]
    [EmailAddress(ErrorMessage = "Please enter a valid email address.")]
    [StringLength(150, ErrorMessage = "Email cannot exceed 150 characters.")]
    [Display(Name = "Email Address")]
    public string Email { get; set; } = string.Empty;

    [StringLength(200, ErrorMessage = "Subject cannot exceed 200 characters.")]
    [Display(Name = "Subject (Optional)")]
    public string? Subject { get; set; }

    [Required(ErrorMessage = "Please write a message.")]
    [StringLength(4000, MinimumLength = 10, ErrorMessage = "Message must be between 10 and 4000 characters.")]
    [Display(Name = "Message")]
    public string Message { get; set; } = string.Empty;

    /// <summary>
    /// Honeypot field for spam prevention. Must remain empty.
    /// </summary>
    public string? HoneyPotCompany { get; set; }
}
