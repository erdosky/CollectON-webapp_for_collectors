const mongoose = require('mongoose');

const exhibitSchema = new mongoose.Schema({
  name: String,
  description: String,
  year: String,
  state: String,
  collectionId: String,
  image: String,
  toSold: String
});

const Exhibit = mongoose.model("Exhibit", exhibitSchema)

module.exports = Exhibit
