import jwt from 'jsonwebtoken';

// Fallback secret key for local development (In production, this must be in a .env file)
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_hrms_key_2026';

interface TokenPayload {
    userId: string;
    role: string;
}

/**
 * Generates a secure JWT token for a authenticated user session
 * @param payload Object containing user ID and Assigned Enterprise Role
 */
export const generateToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: '24h', // Standard token expiration window
    });
};
/**
 * Verifies an incoming JWT token from client requests
 * @param token The raw token string from the Authorization header
 */
export const verifyToken = (token: string): TokenPayload => {
    try {
        return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (error) {
        throw new Error('Invalid or expired token security signature.');
    }
};
