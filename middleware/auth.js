// Import dependencies
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    // const token = req.header("x-auth-token");
    const token = req.header("Authorization");
    
    if (!token) return res.status(401).send({
        ok: false,
        error: "Access denied. No token provided"
    });

    try {
        const decoded = jwt.verify(token, process.env.tokens_secret);
        req.user = decoded;
    } catch (error) {
        return res.status(401).send({
            ok: false,
            error: "Token expired"
        });
    }

    next();
}