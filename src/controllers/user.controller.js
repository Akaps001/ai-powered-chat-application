import { userService } from '../services/index.js';

/**
 * Controller for User resource management.
 * Handles standard CRUD operations for Users.
 */
class UserController {
    /**
     * Get all users.
     * Note: In a real app, this should probably be paginated.
     */
    async getAllUsers(req, res) {
        const users = await userService.find();
        res.json(users);
    }

    /**
     * Get a single user by ID.
     * Expects an 'id' parameter in the URL route (e.g., /users/:id).
     */
    async getUserById(req, res) {
        const user = await userService.findById(req.params.id);
        if (!user) {
            // Return 404 if user doesn't exist
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    }

    /**
     * Update a user's information.
     */
    async updateUser(req, res) {
        // Service handles the database update logic
        const user = await userService.update(req.params.id, req.body);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    }

    /**
     * Delete a user.
     */
    async deleteUser(req, res) {
        await userService.delete(req.params.id);
        // Send 204 No Content for successful deletion
        res.status(204).send();
    }
}

export default new UserController();
