import { type NextResponse } from "next/server";
import { z } from "zod";

/**
 * Standard API Error Codes
 * Following REST conventions and providing machine-readable error identification
 */
export enum ApiErrorCode {
    // Authentication & Authorization (401-403)
    UNAUTHORIZED = "UNAUTHORIZED",
    INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
    FORBIDDEN = "FORBIDDEN",
    INSUFFICIENT_PERMISSIONS = "INSUFFICIENT_PERMISSIONS",

    // Validation & Request Errors (400, 422)
    BAD_REQUEST = "BAD_REQUEST",
    VALIDATION_ERROR = "VALIDATION_ERROR",
    INVALID_INPUT = "INVALID_INPUT",
    MISSING_REQUIRED_FIELD = "MISSING_REQUIRED_FIELD",

    // Resource Errors (404, 409)
    NOT_FOUND = "NOT_FOUND",
    RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND",
    CONFLICT = "CONFLICT",
    DUPLICATE_RESOURCE = "DUPLICATE_RESOURCE",

    // Rate Limiting & Quotas (429)
    RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
    QUOTA_EXCEEDED = "QUOTA_EXCEEDED",

    // Server & Service Errors (500-503)
    INTERNAL_ERROR = "INTERNAL_ERROR",
    DATABASE_ERROR = "DATABASE_ERROR",
    EXTERNAL_SERVICE_ERROR = "EXTERNAL_SERVICE_ERROR",
    AI_SERVICE_ERROR = "AI_SERVICE_ERROR",
    SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE",

    // Parsing & Format Errors
    PARSE_ERROR = "PARSE_ERROR",
    INVALID_JSON = "INVALID_JSON",
    INVALID_FORMAT = "INVALID_FORMAT",

    // Feature-Specific Errors
    DIAGRAM_ERROR = "DIAGRAM_ERROR",
    PROJECT_ERROR = "PROJECT_ERROR",
    IMPORT_ERROR = "IMPORT_ERROR",
    EXPORT_ERROR = "EXPORT_ERROR",
}

/**
 * HTTP Status Code mapping
 */
export const ErrorStatusMap: Record<ApiErrorCode, number> = {
    // 400 Bad Request
    [ApiErrorCode.BAD_REQUEST]: 400,
    [ApiErrorCode.INVALID_INPUT]: 400,
    [ApiErrorCode.INVALID_JSON]: 400,
    [ApiErrorCode.INVALID_FORMAT]: 400,

    // 401 Unauthorized
    [ApiErrorCode.UNAUTHORIZED]: 401,
    [ApiErrorCode.INVALID_CREDENTIALS]: 401,

    // 403 Forbidden
    [ApiErrorCode.FORBIDDEN]: 403,
    [ApiErrorCode.INSUFFICIENT_PERMISSIONS]: 403,

    // 404 Not Found
    [ApiErrorCode.NOT_FOUND]: 404,
    [ApiErrorCode.RESOURCE_NOT_FOUND]: 404,

    // 409 Conflict
    [ApiErrorCode.CONFLICT]: 409,
    [ApiErrorCode.DUPLICATE_RESOURCE]: 409,

    // 422 Unprocessable Entity
    [ApiErrorCode.VALIDATION_ERROR]: 422,
    [ApiErrorCode.MISSING_REQUIRED_FIELD]: 422,

    // 429 Too Many Requests
    [ApiErrorCode.RATE_LIMIT_EXCEEDED]: 429,
    [ApiErrorCode.QUOTA_EXCEEDED]: 429,

    // 500 Internal Server Error
    [ApiErrorCode.INTERNAL_ERROR]: 500,
    [ApiErrorCode.DATABASE_ERROR]: 500,
    [ApiErrorCode.PARSE_ERROR]: 500,
    [ApiErrorCode.DIAGRAM_ERROR]: 500,
    [ApiErrorCode.PROJECT_ERROR]: 500,
    [ApiErrorCode.IMPORT_ERROR]: 500,
    [ApiErrorCode.EXPORT_ERROR]: 500,

    // 502 Bad Gateway
    [ApiErrorCode.EXTERNAL_SERVICE_ERROR]: 502,
    [ApiErrorCode.AI_SERVICE_ERROR]: 502,

    // 503 Service Unavailable
    [ApiErrorCode.SERVICE_UNAVAILABLE]: 503,
};

/**
 * Standard API Error Response Structure
 */
export interface ApiErrorResponse {
    success: false;
    error: {
        code: ApiErrorCode;
        message: string;
        details?: unknown;
        field?: string;
        timestamp: string;
        requestId?: string;
    };
}

/**
 * API Error class for throwing structured errors
 */
export class ApiError extends Error {
    public readonly code: ApiErrorCode;
    public readonly statusCode: number;
    public readonly details?: unknown;
    public readonly field?: string;

    constructor(
        code: ApiErrorCode,
        message: string,
        details?: unknown,
        field?: string,
    ) {
        super(message);
        this.name = "ApiError";
        this.code = code;
        this.statusCode = ErrorStatusMap[code];
        this.details = details;
        this.field = field;

        // Maintains proper stack trace for where error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ApiError);
        }
    }
}

/**
 * Create an API error response with consistent structure
 */
export function createApiErrorResponse(
    code: ApiErrorCode,
    message: string,
    details?: unknown,
    field?: string,
    requestId?: string,
): ApiErrorResponse {
    const errorObj: {
        code: ApiErrorCode;
        message: string;
        details?: unknown;
        field?: string;
        timestamp: string;
        requestId?: string;
    } = {
        code,
        message,
        timestamp: new Date().toISOString(),
    };

    if (details !== undefined) errorObj.details = details;
    if (field !== undefined) errorObj.field = field;
    if (requestId !== undefined) errorObj.requestId = requestId;

    return {
        success: false,
        error: errorObj,
    };
}

/**
 * Convert any error into a Response object with proper JSON formatting
 */
export function toErrorResponse(error: unknown, requestId?: string): Response {
    // Handle ApiError instances
    if (error instanceof ApiError) {
        const errorResponse = createApiErrorResponse(
            error.code,
            error.message,
            error.details,
            error.field,
            requestId,
        );

        return new Response(JSON.stringify(errorResponse), {
            status: error.statusCode,
            headers: { "Content-Type": "application/json" },
        });
    }

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
        const firstError = error.issues[0];
        const field = firstError.path.join(".");
        const message = firstError.message;

        const errorResponse = createApiErrorResponse(
            ApiErrorCode.VALIDATION_ERROR,
            message,
            error.issues,
            field,
            requestId,
        );

        return new Response(JSON.stringify(errorResponse), {
            status: 422,
            headers: { "Content-Type": "application/json" },
        });
    }

    // Handle JSON parsing errors (SyntaxError)
    if (error instanceof SyntaxError) {
        const errorResponse = createApiErrorResponse(
            ApiErrorCode.INVALID_JSON,
            "Invalid JSON format in request body",
            undefined,
            undefined,
            requestId,
        );

        return new Response(JSON.stringify(errorResponse), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    // Handle standard Error instances
    if (error instanceof Error) {
        // Extract status code and error code from message patterns
        let code = ApiErrorCode.INTERNAL_ERROR;
        let status = 500;

        // Pattern matching for common error types
        if (
            error.message.includes("not found") ||
            error.message.includes("Not Found")
        ) {
            code = ApiErrorCode.NOT_FOUND;
            status = 404;
        } else if (
            error.message.includes("unauthorized") ||
            error.message.includes("Unauthorized")
        ) {
            code = ApiErrorCode.UNAUTHORIZED;
            status = 401;
        } else if (
            error.message.includes("rate limit") ||
            error.message.includes("Rate Limit")
        ) {
            code = ApiErrorCode.RATE_LIMIT_EXCEEDED;
            status = 429;
        } else if (
            error.message.includes("database") ||
            error.message.includes("Database")
        ) {
            code = ApiErrorCode.DATABASE_ERROR;
            status = 500;
        } else if (
            error.message.includes("API key") ||
            error.message.includes("Anthropic") ||
            error.message.includes("AI")
        ) {
            code = ApiErrorCode.AI_SERVICE_ERROR;
            status = 502;
        }

        const errorResponse = createApiErrorResponse(
            code,
            error.message,
            undefined,
            undefined,
            requestId,
        );

        return new Response(JSON.stringify(errorResponse), {
            status,
            headers: { "Content-Type": "application/json" },
        });
    }

    // Handle unknown errors
    const errorResponse = createApiErrorResponse(
        ApiErrorCode.INTERNAL_ERROR,
        "An unexpected error occurred",
        undefined,
        undefined,
        requestId,
    );

    return new Response(JSON.stringify(errorResponse), {
        status: 500,
        headers: { "Content-Type": "application/json" },
    });
}

/**
 * Default error handler for API routes
 * Compatible with Edge runtime - does not include stack traces in production
 */
export default function handleApiError(
    error: unknown,
    requestId?: string,
): Response {
    // Log error for debugging (will be available in Cloudflare logs)
    console.error("API Error:", {
        error: error instanceof Error ? error.message : String(error),
        requestId,
        timestamp: new Date().toISOString(),
        // Note: Stack traces are not included to maintain Edge runtime compatibility
        // and to avoid exposing internal details in production
    });

    return toErrorResponse(error, requestId);
}

/**
 * Utility functions for creating common errors
 */

export function unauthorizedError(
    message = "Unauthorized - Please log in",
): ApiError {
    return new ApiError(ApiErrorCode.UNAUTHORIZED, message);
}

export function forbiddenError(
    message = "You don't have permission to access this resource",
): ApiError {
    return new ApiError(ApiErrorCode.FORBIDDEN, message);
}

export function notFoundError(resource: string, message?: string): ApiError {
    return new ApiError(
        ApiErrorCode.NOT_FOUND,
        message || `${resource} not found`,
    );
}

export function validationError(
    message: string,
    field?: string,
    details?: unknown,
): ApiError {
    return new ApiError(ApiErrorCode.VALIDATION_ERROR, message, details, field);
}

export function conflictError(message: string, details?: unknown): ApiError {
    return new ApiError(ApiErrorCode.CONFLICT, message, details);
}

export function rateLimitError(
    message = "Too many requests. Please try again later.",
): ApiError {
    return new ApiError(ApiErrorCode.RATE_LIMIT_EXCEEDED, message);
}

export function databaseError(
    message = "Database operation failed",
    details?: unknown,
): ApiError {
    return new ApiError(ApiErrorCode.DATABASE_ERROR, message, details);
}

export function aiServiceError(
    message = "AI service error. Please try again.",
    details?: unknown,
): ApiError {
    return new ApiError(ApiErrorCode.AI_SERVICE_ERROR, message, details);
}

export function internalError(
    message = "Internal server error",
    details?: unknown,
): ApiError {
    return new ApiError(ApiErrorCode.INTERNAL_ERROR, message, details);
}

/**
 * Wrap an async API handler with error handling
 * Use this to ensure consistent error responses across all endpoints
 */
export function withErrorHandling<T>(
    handler: (request: Request, ...args: unknown[]) => Promise<T>,
) {
    return async (
        request: Request,
        ...args: unknown[]
    ): Promise<T | Response> => {
        try {
            return await handler(request, ...args);
        } catch (error) {
            return handleApiError(error);
        }
    };
}
