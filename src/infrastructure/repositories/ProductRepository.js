const Product = require("../models/product");

class ProductRepository {
  async createProduct(productData) {
    return await Product.createProduct(productData);
  }

  async getProductById(productId) {
    return await Product.getProductById(productId);
  }

  async find(filters) {
    return await Product.find(filters);
  }
}

module.exports = new ProductRepository();
