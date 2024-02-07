const mongoose = require('mongoose');

const exchangeOfferSchema = new mongoose.Schema({
  buyerEmail: String,
  sellerEmail: String,
  message: String,
  offeredExhibitId: String,
  exhibitId: String,
});

const ExchangeOffer = mongoose.model("ExchangeOffer", exchangeOfferSchema);

module.exports = ExchangeOffer;

