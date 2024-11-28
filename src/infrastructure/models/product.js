const { getDb } = require("../db/mongodb");
const { ObjectId } = require("mongodb");

const collectionName = "products";

const createProduct = async (productData) => {
  const db = getDb();
  await db.collection(collectionName).insertOne(productData);
};

const getProductById = async (productId) => {
  const db = getDb();
  return await db
    .collection(collectionName)
    .findOne({ _id: ObjectId.createFromHexString(productId) });
};

const find = async (filters) => {
  const db = getDb();

  const { limit, offset, sort } = filters;

  let cursor = await db.collection(collectionName).find();

  if (sort) {
    cursor = cursor.sort(sort);
  }

  if (offset) {
    cursor = cursor.skip(offset);
  }

  if (limit) {
    cursor = cursor.limit(limit);
  }

  const [items, total] = await Promise.all([
    cursor.toArray(),
    db.collection(collectionName).estimatedDocumentCount(),
  ]);

  return { items, page: Math.ceil(offset / limit) + 1, total };
};

module.exports = { createProduct, getProductById, find };
