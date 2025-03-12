import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    const token = req.cookies.jwt; 

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY); 
        req.user_id = decoded.user_id; 
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

export default verifyToken;
