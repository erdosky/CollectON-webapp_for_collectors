const mongoose = require('mongoose');

const purchaseOfferSchema = new mongoose.Schema({
  buyerEmail: String,
  sellerEmail: String,
  price: String,
  message: String,
  exhibitId: String
});

const PurchaseOffer = mongoose.model("PurchaseOffer", purchaseOfferSchema);

module.exports = PurchaseOffer;

