const UserService = require("../../application/services/UserService");

class UserController {
  async createUser(request, reply) {
    try {
      await UserService.createUser(request.body);
      reply.code(201).send(null);
    } catch (error) {
      reply.code(500).send({ error: error.message });
    }
  }

  async getUserById(request, reply) {
    try {
      const user = await UserService.getUserById(request.params.id);
      if (!user) {
        reply.code(404).send({ error: "User not found" });
      } else {
        reply.send(user);
      }
    } catch (error) {
      reply.code(500).send({ error: error.message });
    }
  }

  async getAllUsers(request, reply) {
    try {
      const users = await UserService.getAllUsers();
      reply.send(users);
    } catch (error) {
      reply.code(500).send({ error: error.message });
    }
  }
}

module.exports = new UserController();
