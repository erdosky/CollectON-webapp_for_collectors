const PurchaseOffer = require("../models/purchaseOffer");
const Exhibit = require("../models/exhibit");
const User = require("../models/user");

const createPurchaseOffer = async (req, res) => {
  const buyerEmail = req.body.buyerEmail;
  const sellerEmail = req.body.sellerEmail;
  const price = req.body.price;
  const message = req.body.message;
  const exhibitId = req.body.exhibitId;

  const buyer = await User.find({ email: buyerEmail });
  if (!buyer) {
    return res
      .status(404)
      .json({ message: "User with given email not found." });
  }

  const seller = await User.find({ email: sellerEmail });

  if (!seller) {
    return res.status(404).json({ message: "User with email id not found." });
  }

  const exhibit = await Exhibit.findOne({ _id: exhibitId });

  if (!exhibit) {
    return res
      .status(404)
      .json({ message: "Exhibit with given id not found." });
  }

  const newPurchaseOffer = new PurchaseOffer({
    buyerEmail: buyerEmail,
    sellerEmail: sellerEmail,
    price: price,
    message: message,
    exhibitId: exhibitId,
  });

  newPurchaseOffer.save().then(() => {
    return res.status(200).json({ message: "Purchase offer added." });
  });
};

const getPurchaseOffersBySeller = async (req, res) => {
  const sellerEmail = req.params.email;
  const trimmedSellerEmail = sellerEmail.replace(":", "");

  try {
    const purchaseOffers = await PurchaseOffer.find({
      sellerEmail: trimmedSellerEmail,
    });

    if (!purchaseOffers || purchaseOffers.length === 0) {
      return res
        .status(404)
        .json({ message: "No purchase offers found for this seller." });
    }

    return res.status(200).json(purchaseOffers);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error retrieving purchase offers." });
  }
};

const deletePurchaseOfferById = async (req, res) => {
  try {
    const offerId = req.params.id;
    console.log(offerId);
    console.log(req.params);

    const trimmedOfferId = offerId.replace(":", "");

    const deletedOffer = await PurchaseOffer.findByIdAndDelete(
      trimmedOfferId
    );

    if (!deletedOffer) {
      return res.status(404).json({ message: "Offer not found." });
    }

    res.status(200).json({ message: "Purchase offer successfully deleted." });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "There was an error deleting the offer." });
  }
};

module.exports = {
  createPurchaseOffer: createPurchaseOffer,
  getPurchaseOffersBySeller: getPurchaseOffersBySeller,
  deletePurchaseOfferById: deletePurchaseOfferById
};
