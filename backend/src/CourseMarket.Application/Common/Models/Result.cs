namespace CourseMarket.Application.Common.Models;

public class Result<T>
{
    public bool IsSuccess { get; set; }
    public T? Data { get; set; }
    public string? Error { get; set; }
    public Dictionary<string, string[]>? ValidationErrors { get; set; }

    public static Result<T> Success(T data)
    {
        return new Result<T>
        {
            IsSuccess = true,
            Data = data
        };
    }

    public static Result<T> Failure(string error)
    {
        return new Result<T>
        {
            IsSuccess = false,
            Error = error
        };
    }

    public static Result<T> ValidationFailure(Dictionary<string, string[]> errors)
    {
        return new Result<T>
        {
            IsSuccess = false,
            Error = "Validation failed",
            ValidationErrors = errors
        };
    }
}
