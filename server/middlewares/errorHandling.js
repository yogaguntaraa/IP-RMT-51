module.exports = function errorHandling(err, req, res, next) {
    console.log(err)
    let status = err.status || 500;
    let message = err.message || "Internal server error"
    switch (err.name) {
        case "SequelizeValidationError":
        case "SequelizeUniqueConstrainError":
            status = 400;
            message = err.errors[0].message;
            break;
        case "Email and Password are required":
            status = 400;
            message = "Email and Password are required";
            break;
        case "Image is required":
            status = 400;
            message = "Image is required";
            break;
        case "Unauthorized":
        case "JsonWebTokenError":
            status = 401;
            message = "Login failed";
            break;
        case "MissingGoogleToken":
            status = 401;
            message = "Unaunthenticated";
            break;
        case "Invalid Email or Password":
            status = 401;
            message = "Email or Password is incorrect";
            break;
        case "Forbidden":
            status = 403;
            message = "Forbidden";
            break;
        case "NotFound":
            status = 404;
            message = "Data Not Found";
            break;
        default:
            break;
    }
    res.status(status).json({ message });
}