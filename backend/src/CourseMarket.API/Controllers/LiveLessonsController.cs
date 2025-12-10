using CourseMarket.Application.LiveLessons.Commands;
using CourseMarket.Application.LiveLessons.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CourseMarket.API.Controllers;

[ApiController]
[Route("api/live-lessons")]
[Authorize]
public class LiveLessonsController : ControllerBase
{
    private readonly IMediator _mediator;

    public LiveLessonsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("requests")]
    public async Task<IActionResult> CreateLessonRequest([FromBody] CreateLessonRequestCommand command)
    {
        var result = await _mediator.Send(command);

        if (!result.IsSuccess)
        {
            return BadRequest(new { error = result.Error });
        }

        return Ok(result.Data);
    }

    [HttpGet("my-requests")]
    public async Task<IActionResult> GetMyLessonRequests()
    {
        var query = new GetMyLessonRequestsQuery();
        var result = await _mediator.Send(query);

        if (!result.IsSuccess)
        {
            return BadRequest(new { error = result.Error });
        }

        return Ok(result.Data);
    }

    [Authorize(Roles = "Instructor,Admin")]
    [HttpGet("assigned")]
    public async Task<IActionResult> GetAssignedLessons()
    {
        var query = new GetAssignedLessonsQuery();
        var result = await _mediator.Send(query);

        if (!result.IsSuccess)
        {
            return BadRequest(new { error = result.Error });
        }

        return Ok(result.Data);
    }

    [HttpPatch("requests/{id}/status")]
    public async Task<IActionResult> UpdateRequestStatus(int id, [FromBody] UpdateRequestStatusCommand command)
    {
        command.RequestId = id;
        var result = await _mediator.Send(command);

        if (!result.IsSuccess)
        {
            return BadRequest(new { error = result.Error });
        }

        return Ok(result.Data);
    }
}
