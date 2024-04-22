const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    if (!err.statusCode) {
        statusCode = 500;
        message = 'Internal Server Error';
    }

    res.status(statusCode).json({ error: message });
};

module.exports = errorHandler;
