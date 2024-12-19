export const globalErrorHandler = (err, req, res, next) => {
    // Set the default status code and error message
    let statusCode = err.statusCode || 500;
    let clientMessage = err.message || 'Internal Server Error. Please Try Again Later...';

    // Respond to the client
    res.status(statusCode).json({
        status: 'error',
        message: clientMessage
    });
};