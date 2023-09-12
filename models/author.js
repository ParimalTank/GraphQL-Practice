const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema({
  name: String,
  age: Number,
  //   bookId: String,
});

module.exports = mongoose.model("Author", authorSchema);
