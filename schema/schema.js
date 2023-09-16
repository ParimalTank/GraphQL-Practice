const graphql = require("graphql");
const _ = require("lodash");

//Import Schema
const Book = require("../models/book");
const Author = require("../models/author");

// Defining the Schema

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

//Dummy data for lazy ones :)

// const books = [
//   { name: "Name of the Wind", genre: "Fantasy", id: "1", authorId: "1" },
//   { name: "The Final Empire", genre: "Fantasy", id: "2", authorId: "2" },
//   { name: "The Long Earth", genre: "Sci-Fi", id: "3", authorId: "3" },
//   { name: "The Hero of Ages", genre: "Fantasy", id: "4", authorId: "2" },
//   { name: "The Colour of Magic", genre: "Fantasy", id: "5", authorId: "3" },
//   { name: "The Light Fantastic", genre: "Fantasy", id: "6", authorId: "3" },
// ];

// const authors = [
//   { name: "Patrick Rothfuss", age: 44, id: "1" },
//   { name: "Brandon Sanderson", age: 42, id: "2" },
//   { name: "Terry Pratchett", age: 66, id: "3" },
// ];

// This Query is Also Known as RIP Query

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    authorId: { type: GraphQLID },
    author: {
      // Add Relationship between author and books
      type: AuthorType,
      resolve(parent, args) {
        // return _.find(authors, { id: parent.authorId });

        return Author.findById(parent.authorId);
      },
    },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    // If we remove the call back from the files and make it as object so that having a issue of 22 catch. But because they are objects that are not resolved until run-time, we get the catch-22 problem and hence have to wrap them inside of functions.
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        console.log("parent: ", parent);
        // return _.filter(books, { authorId: parent.id });

        // return books.filter(bk => bk.authorId === parent.id)
        return Book.find({ authorId: parent.id }); // Find author, who have written a Book
      },
    },
  }),
});

// RootQuery means first request get here and inside that find particular schema, for example Book

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLString } }, // here we can use GraphQLID instead of GraphQLString of  // args means same as find by id for book data
      // because this is only accept string id GraphQLString  so the type is always string
      resolve(parent, args) {
        // Code to get Data from the Database / other resources
        // This is Find into a books array with given id
        // return _.find(books, { id: args.id });
        return Book.findById(args.id); // Find By Id For Book
      },
    },
    author: {
      // Author Type
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // return _.find(authors, { id: args.id });
        return Author.findById(args.id);
      },
    },
    books: {
      // Get The List of Books
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        // return books;
        return Book.find({});
      },
    },
    authors: {
      // Get The List of Authors
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        // return authors;
        return Author.find({});
      },
    },
  },
});

// Mutation Means What Data need To Update/changes define that
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parent, args) {
        // Author is Model which we have declare above // create a new Instance
        let author = new Author({
          name: args.name,
          age: args.age,
        });

        // Save author to the database
        return author.save();
      },
    },
    addBook: {
      type: BookType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        let book = new Book({
          name: args.name,
          genre: args.genre,
          authorId: args.authorId,
        });

        return book.save();
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
