export default function errorHandler(error, req, res, next) {
    console.error(error);

    const statusCode = error.statusCode || 500;
    const message = error.message || 'Something went wrong';

    res.status(statusCode).json({
        statusCode,
        error: error.name || 'Internal Server Error',
        message,
        // Include validation details if present (from Zod)
        validation: error.errors || undefined
    });
}
