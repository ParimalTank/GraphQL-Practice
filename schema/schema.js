const graphql = require("graphql");

// Defining the Schema

const { GraphQLObjectType, GraphQLString, GraphQLSchema } = graphql;

// This Query is Also Known as RIP Query

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
  }),
});

// RootQuery means first request get here and inside that find particular schema, for example Book

const RootQuery = new GraphQLType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLString } }, // args means same as find by id for book data
      resolve(parent, args) {
        // Code to get Data from the Database / other resources
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
