const { MongoClient } = require("mongodb");
const { faker } = require("@faker-js/faker");

async function main() {
  const productCount = 100_000;
  const userCount = 1000;
  const orderCount = 100_000;
  const client = await MongoClient.connect("mongodb://localhost:27017/pw10");
  const db = client.db();

  console.log("Seeding Products...");
  const productData = Array.from({ length: productCount }).map(() => ({
    _id: faker.string.uuid(),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price({ min: 1, max: 1000, dec: 2 })),
    releaseDate: faker.date.between({ from: "2024-01-01", to: "2024-12-31" }),
  }));

  await db.collection("products").insertMany(productData);

  console.log(`${productCount} Products seeded.`);

  console.log("Seeding Users...");
  const userData = await Promise.all(
    Array.from({ length: userCount }).map(async () => ({
      _id: faker.string.uuid(),
      username: `${faker.internet.username()}-${faker.git.commitSha()}`,
      password: faker.internet.password(),
    }))
  );

  await db.collection("users").insertMany(userData);

  console.log(`${userCount} Users seeded.`);

  console.log("Seeding Orders...");
  const ordersData = Array.from({ length: orderCount }).map(() => {
    const userId = faker.number.int({ min: 0, max: userCount - 1 });
    const productDetails = Array.from({
      length: faker.number.int({ min: 1, max: 10 }),
    }).map(() => {
      const prodId = faker.number.int({ min: 0, max: productCount - 1 });

      return productData[prodId];
    });

    return {
      _id: faker.string.uuid(),
      userId: userData[userId]._id,
      products: productDetails,
      totalAmount: faker.commerce.price({ min: 300 }),
    };
  });

  await db.collection("orders").insertMany(ordersData);

  console.log(`${orderCount} Orders seeded.`);
}

main().catch((e) => {
  console.error("Error seeding data:", e);
  process.exit(1);
});
