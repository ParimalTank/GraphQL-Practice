const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema/schema");

const app = express();

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
