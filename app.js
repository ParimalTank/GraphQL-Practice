const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema/schema");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Allow Cross Origin Request
app.use(cors());

mongoose.connect(process.env.MONGO_URL);

mongoose.connection.once("open", () => {
  console.log("Mongodb Connected........");
});

// Write a middleware handling the graphql query
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.listen(4000, () => {
  console.log("Server is Running on 4000......");
});
