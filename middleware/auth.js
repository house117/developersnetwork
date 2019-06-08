const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function(req, res, next) {
    // obtener el token desde el header
    const token = req.header("x-auth-token");
    // verificar si no hay un token
    if (!token) {
        return res.status(401).json({
            msg: "Token faltante, acceso denegado"
        });
    }
    try {
        const decoded = jwt.verify(token, config.get("jwtSecret"));
        req.user = decoded.user;
        next();
    } catch (error) {
        res.status(401).json({
            msg: "El token no es válido"
        });
    }
};
