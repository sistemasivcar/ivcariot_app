import jwt from "jsonwebtoken";

export default function checkAuth(req, res, next) {
    
    const token = req.get('x-auth-token');
    if (!token) return res.status(401).json({ status: 'error', message:'no token provided'});

    try {
        const payload = jwt.verify(token, process.env.SECURE_JWT_KEY);
        req.userData = payload.userData;
        next();
    } catch (e) {
        res.status(400).json({ status: 'error', message: 'invalid token' });

    }
}