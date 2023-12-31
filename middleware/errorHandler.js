const errorHandler = (err, req, res, next) => {
    const status = res.statusCode ? res.statusCode : 500; // server error

    res.status(status).json({ message: err.message });
};

module.exports = errorHandler;
