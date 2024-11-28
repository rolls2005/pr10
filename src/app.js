const fastify = require("fastify")();
const { connectDatabase } = require("./infrastructure/db/mongodb");
const routes = require("./routes");
const swagger = require("./plugins/swagger");

connectDatabase();

swagger(fastify);

fastify.register(routes);

fastify.listen({ port: 3000, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log(`Server running at ${address}`);
});
