const { getDb } = require("../db/mongodb");
const { ObjectId } = require("mongodb");

const collectionName = "users";

const createUser = async (userData) => {
  const db = getDb();
  await db.collection(collectionName).insertOne(userData);
};

const getUserById = async (userId) => {
  const db = getDb();
  return await db
    .collection(collectionName)
    .findOne({ _id: ObjectId.createFromHexString(userId) });
};

const getAllUsers = async () => {
  const db = getDb();
  return await db.collection(collectionName).find().toArray();
};

module.exports = { createUser, getUserById, getAllUsers };
