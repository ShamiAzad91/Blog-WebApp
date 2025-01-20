function errorMiddleware(err, req, res, next) {
    console.error(err.stack);
    if (res.headerSent) {
        return next(err);
    }
    console.log("Error Middleware called");
    res.status(500).json({
       ok:false,
        message: err.message
    });
}

module.exports = errorMiddleware;
