import { authService } from '../services/index.js';

/**
 * Controller for handling authentication-related HTTP requests.
 * Acts as an interface between the HTTP transport layer (Fastify) and the business logic layer (AuthService).
 */
class AuthController {
    /**
     * Handles user registration.
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next function
     */
    async register(req, res) {
        // Delegate business logic to the service layer
        // req.body contains the validated data (email, password)
        const result = await authService.register(req.body);

        // Send 201 Created response
        res.status(201).json(result);
    }

    /**
     * Handles user login.
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next function
     */
    async login(req, res) {
        const { email, password } = req.body;
        // Service returns user object and JWT token
        const result = await authService.login(email, password);
        res.json(result);
    }

    /**
     * Retrieves current authenticated user.
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next function
     */
    async getMe(req, res) {
        // req.user is populated by the auth middleware
        res.json(req.user);
    }
}

export default new AuthController();
