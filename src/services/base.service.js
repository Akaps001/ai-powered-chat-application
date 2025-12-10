/**
 * BaseService
 * 
 * Think of this class as a "Standard Operating Procedure" for our business logic.
 * Instead of rewriting "how to save to the database" or "how to find something" 
 * in every single Service (User, Chat, Auth), we write it once here.
 * 
 * It acts as a middleman between the Controller (who handles the web request) 
 * and the Repository (who touches the database).
 */
class BaseService {
  /**
   * @param {Object} repository - The specific "Database Access" tool this service will use.
   *                              For UserService, this will be the UserRepository.
   * @param {Object} logger - A tool to print messages (console usually). 
   */
  constructor(repository, logger = console) {
    this.repository = repository; // The "Pantry" we get data from
    this.logger = logger;
  }

  /**
   * Create a new item.
   * Usage: someService.create({ name: 'John' })
   * @param {Object} data - The information to save.
   */
  async create(data) {
    // Delegate the actual saving work to the repository
    return await this.repository.create(data);
  }

  /**
   * Find multiple items matching a criteria.
   * @param {Object} query - The search filters (e.g., { role: 'admin' }).
   */
  async find(query) {
    return await this.repository.find(query);
  }

  /**
   * Find exactly one item matching a criteria.
   * @param {Object} query - The search filters.
   */
  async findOne(query) {
    return await this.repository.findOne(query);
  }

  /**
   * Find one item by its unique ID.
   * @param {string} id - The unique identifier (like a badge number).
   */
  async findById(id) {
    return await this.repository.findById(id);
  }

  /**
   * Update an existing item.
   * @param {string} id - The unique ID of the item to update.
   * @param {Object} data - The new information to overwrite/merge.
   */
  async update(id, data) {
    return await this.repository.update(id, data);
  }

  /**
   * Delete an item.
   * @param {string} id - The unique ID of the item to remove.
   */
  async delete(id) {
    return await this.repository.delete(id);
  }
}

export default BaseService;
