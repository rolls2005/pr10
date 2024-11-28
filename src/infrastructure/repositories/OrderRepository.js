const Order = require("../models/order");

class OrderRepository {
  async createOrder(orderData) {
    return await Order.createOrder(orderData);
  }

  async getOrderById(orderId) {
    return await Order.getOrderById(orderId);
  }

  async getOrdersByUser(filters) {
    return await Order.getOrdersByUser(filters);
  }
}

module.exports = new OrderRepository();
