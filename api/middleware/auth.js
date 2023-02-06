import jwt from "jsonwebtoken";

module.exports = function checkAuth(req, res, next) {
    
    const token = req.get('x-auth-token');
    console.log(token)
    if (!token) return res.status(401).json({ status: 'error', message:'no token provided'});

    try {
        const payload = jwt.verify(token, 'securePasswordHere');
        req.userData = payload.userData;
        next();
    } catch (e) {
        res.status(400).json({ status: 'error', message: 'invalid token' });

    }
}