import jwt from 'jsonwebtoken';
// Fallback secret key for local development (In production, this must be in a .env file)
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_hrms_key_2026';
/**
 * Generates a secure JWT token for a authenticated user session
 * @param payload Object containing user ID and Assigned Enterprise Role
 */
export const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: '24h', // Standard token expiration window
    });
};
/**
 * Verifies an incoming JWT token from client requests
 * @param token The raw token string from the Authorization header
 */
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    }
    catch (error) {
        throw new Error('Invalid or expired token security signature.');
    }
};
