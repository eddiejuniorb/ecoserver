
const StatusCodes = {
    success: 200,
    notFound: 404,
    acceppted: 202,
    internalError: 500,
    badRequest: 400,
    unathorized: 401,
    forbidden: 403.
}


class BaseError extends Error {
    message
    statusCode
    isOperational

    constructor(message, statusCode, isOperational) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.message = message;
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this);
    }
}

class apiNotFoundError extends BaseError {
    constructor(message = "resource not found") {
        super(message, StatusCodes.notFound, true);
    }
}


class apiBadRequestError extends BaseError {
    constructor(message = "bad request") {
        super(message, StatusCodes.badRequest, true);
    }
}

class apiForbiddenError extends BaseError {
    constructor(message = "Forbidden: You do not have access to this resource") {
        super(message, StatusCodes.forbidden, true);
    }
}


class apiUnthorizedError extends BaseError {
    constructor(message = "Unauthorized") {
        super(message, StatusCodes.unathorized, true);
    }
}



module.exports = { BaseError, apiBadRequestError, apiForbiddenError, apiUnthorizedError, apiNotFoundError, StatusCodes }
