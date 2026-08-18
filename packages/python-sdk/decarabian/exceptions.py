class DecarabianError(Exception):
    """Base exception for Decarabian SDK"""
    pass

class UnauthorizedError(DecarabianError):
    """Raised when the agent token is invalid or missing"""
    pass

class ForbiddenError(DecarabianError):
    """Raised when the agent does not have permission to execute the tool"""
    pass

class ToolNotFoundError(DecarabianError):
    """Raised when the requested tool does not exist"""
    pass

class GatewayError(DecarabianError):
    """Raised when the target API fails or returns an error"""
    pass
