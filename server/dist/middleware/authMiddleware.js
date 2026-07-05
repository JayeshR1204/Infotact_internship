import { verifyToken } from '../utils/authUtils.js';
/**
 * Middleware to protect routes by validating incoming JWT signatures
 */
export const protectRoute = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                success: false,
                message: 'Authorization denied. No bearer token provided.'
            });
            return;
        }
        // Extract the raw token string
        const token = authHeader.split(' ')[1];
        // Decode and verify JWT signature
        const decoded = verifyToken(token);
        // Attach decoded user data safely to the request object
        req.user = {
            userId: decoded.userId,
            role: decoded.role
        };
        next();
    }
    catch {
        res.status(401).json({
            success: false,
            message: 'Token verification failed. Unauthorized access.'
        });
    }
};
/**
 * Middleware to restrict route access based on explicit User Roles
 * @param allowedRoles Array of roles authorized to hit the endpoint
 */
export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Authentication session required.'
            });
            return;
        }
        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                message: `Forbidden: Your role (${req.user.role}) is not authorized for this resource.`
            });
            return;
        }
        next();
    };
};
