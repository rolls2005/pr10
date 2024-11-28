const ProductService = require("../../application/services/ProductService");
const { redisClient } = require("../../infrastructure/db/redis");

class ProductController {
  async createProduct(request, reply) {
    try {
      await ProductService.createProduct(request.body);
      reply.code(201).send(null);
    } catch (error) {
      reply.code(500).send({ error: error.message });
    }
  }

  async getProductById(request, reply) {
    try {
      const product = await ProductService.getProductById(request.params.id);
      if (!product) {
        reply.code(404).send({ error: "Product not found" });
      } else {
        reply.send(product);
      }
    } catch (error) {
      reply.code(500).send({ error: error.message });
    }
  }

  async getAllProducts(request, reply) {
    try {
      const { limit, page, sort } = request.query;

      const offset = limit * (page - 1);

      const filters = { limit, offset, sort };

      const cacheKey = `Products:${ProductController.normalizeFilters(filters)}`;

      const cachedProducts = await redisClient.get(cacheKey);

      if (cachedProducts) {
        const products = JSON.parse(cachedProducts);

        if (products.items.length === 0) {
          reply.code(404).send("No products found");
        }

        return reply.send(products);
      }

      const products = await ProductService.find(filters);

      // Cache the result for 1 hour, to reduce load on the database.
      // don't wait for the cache to be set, return the products immediately
      redisClient.set(cacheKey, JSON.stringify(products), "EX", 3600);

      if (products.items.length === 0) {
        reply.code(404).send("No products found");
      }

      reply.send(products);
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

module.exports = new ProductController();
