const OrderRepository = require("../../infrastructure/repositories/OrderRepository");
const ProductRepository = require("../../infrastructure/repositories/ProductRepository");

class OrderService {
  async createOrder(userId, productDetails) {
    const products = await Promise.all(
      productDetails.map(async (detail) => {
        const product = await ProductRepository.getProductById(
          detail.productId
        );
        if (!product) throw new Error("Product not found");
        return product;
      })
    );

    const totalAmount = products.reduce((acc, product) => {
      const productQty = productDetails.find(
        (detail) => detail.productId === product._id.toString()
      ).quantity;
	  
      return acc + product.price * productQty;
    }, 0);

    const orderData = {
      userId,
      products,
      totalAmount,
    };

    return await OrderRepository.createOrder(orderData);
  }

  async getOrderById(orderId) {
    return await OrderRepository.getOrderById(orderId);
  }

  async getOrdersByUser(filters) {
    return await OrderRepository.getOrdersByUser(filters);
  }
}

module.exports = new OrderService();
