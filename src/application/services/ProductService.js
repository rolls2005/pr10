const ProductRepository = require("../../infrastructure/repositories/ProductRepository");

class ProductService {
  async createProduct(productData) {
    return await ProductRepository.createProduct(productData);
  }

  async getProductById(productId) {
    return await ProductRepository.getProductById(productId);
  }

  async find(filters) {
    return await ProductRepository.find(filters);
  }
}

module.exports = new ProductService();
