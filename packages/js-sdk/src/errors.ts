export class DecarabianError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class UnauthorizedError extends DecarabianError {}
export class ForbiddenError extends DecarabianError {}
export class ToolNotFoundError extends DecarabianError {}
export class GatewayError extends DecarabianError {
    public details?: any;
    constructor(message: string, details?: any) {
        super(message);
        this.details = details;
    }
}
