using Leftover.Api.Models;

namespace Leftover.Api;

public interface IJwtService
{
    string GenerateToken(User user);
}
