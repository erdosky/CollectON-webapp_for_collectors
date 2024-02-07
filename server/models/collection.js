const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema({
  name: String,
  type: String,
  description: String,
  ownerEmail: { type: String, index: true },
  image: String,
});

const Collection = mongoose.model("Collection", collectionSchema);

module.exports = Collection;

