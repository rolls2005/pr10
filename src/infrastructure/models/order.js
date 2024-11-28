const { getDb } = require("../db/mongodb");
const { ObjectId } = require("mongodb");

const collectionName = "orders";

const createOrder = async (orderData) => {
  const db = getDb();
  await db.collection(collectionName).insertOne(orderData);
};

const getOrderById = async (orderId) => {
  const db = getDb();
  return await db
    .collection(collectionName)
    .findOne({ _id: ObjectId.createFromHexString(orderId) });
};

const getOrdersByUser = async (filters) => {
  const db = getDb();

  const { limit, offset, userId } = filters;

  let cursor = db.collection(collectionName).find({ userId: userId });

  if (offset) {
    cursor = cursor.skip(offset);
  }

  if (limit) {
    cursor = cursor.limit(limit);
  }

  const [items, total] = await Promise.all([
    cursor.toArray(),
    db.collection(collectionName).countDocuments({ userId: userId }),
  ]);

  return { items, page: Math.ceil(offset / limit) + 1, total };
};

module.exports = { createOrder, getOrderById, getOrdersByUser };
