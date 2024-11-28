const OrderService = require("../../application/services/OrderService");
const { redisClient } = require("../../infrastructure/db/redis");

class OrderController {
  async createOrder(request, reply) {
    try {
      const { userId, productDetails } = request.body;
      await OrderService.createOrder(userId, productDetails);
      reply.code(201).send(null);
    } catch (error) {
      reply.code(500).send({ error: error.message });
    }
  }

  async getOrderById(request, reply) {
    try {
      const order = await OrderService.getOrderById(request.params.id);

      if (!order) {
        reply.code(404).send({ error: "Order not found" });
      } else {
        reply.send(order);
      }
    } catch (error) {
      reply.code(500).send({ error: error.message });
    }
  }

  async getOrdersByUser(request, reply) {
    try {
      const { limit, page } = request.query;

	  const userId = request.params.id;

      const offset = limit * (page - 1);

      const filters = { limit, offset, userId };

      const cacheKey = `Orders:${OrderController.normalizeFilters(filters)}`;

      const cachedOrders = await redisClient.get(cacheKey);

      if (cachedOrders) {
        const orders = JSON.parse(cachedOrders);

        if (orders.items.length === 0) {
          reply.code(404).send("No orders found");
        }

        return reply.send(orders);
      }

      const orders = await OrderService.getOrdersByUser(filters);

      redisClient.set(cacheKey, JSON.stringify(orders), "EX", 3600);

      if (orders.items.length === 0) {
        reply.code(404).send("No orders found");
      }

      reply.send(orders);
    } catch (error) {
      reply.code(500).send({ error: error.message });
    }
  }

  static normalizeFilters(filters) {
    // Convert the object into sorted entries
    const sortedEntries = Object.entries(filters).sort(([keyA], [keyB]) =>
      keyA.localeCompare(keyB)
    ); // Sort by keys alphabetically

    // Convert sorted entries back into an object to ensure JSON.stringify order
    const normalizedObject = Object.fromEntries(sortedEntries);

    // Stringify the normalized object
    return JSON.stringify(normalizedObject);
  }
}

module.exports = new OrderController();
