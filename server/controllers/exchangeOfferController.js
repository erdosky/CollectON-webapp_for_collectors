const ExchangeOffer = require("../models/exchangeOffer");
const Exhibit = require("../models/exhibit");
const User = require("../models/user");

const createExchangeOffer = async (req, res) => {
  const buyerEmail = req.body.buyerEmail;
  const sellerEmail = req.body.sellerEmail;
  const offeredExhibitId = req.body.offeredExhibitId;
  const message = req.body.message;
  const exhibitId = req.body.exhibitId;

  console.log(req.body);

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

  const newExchangeOffer = new ExchangeOffer({
    buyerEmail: buyerEmail,
    sellerEmail: sellerEmail,
    offeredExhibitId: offeredExhibitId,
    message: message,
    exhibitId: exhibitId,
  });

  newExchangeOffer.save().then(() => {
    return res.status(200).json({ message: "Purchase offer added." });
  });
};

const getExchangeOffersBySeller = async (req, res) => {
  const sellerEmail = req.params.email;
  const trimmedSellerEmail = sellerEmail.replace(":", "");

  try {
    const exchangeOffers = await ExchangeOffer.find({
      sellerEmail: trimmedSellerEmail,
    });

    if (!exchangeOffers || exchangeOffers.length === 0) {
      return res
        .status(404)
        .json({ message: "No exchange offers found for this seller." });
    }

    return res.status(200).json(exchangeOffers);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error retrieving exchange offers." });
  }
};

const deleteExchangeOfferById = async (req, res) => {
  try {
    const offerId = req.params.id;
    const trimmedOfferId = offerId.replace(":", "");

    const deletedOffer = await ExchangeOffer.findByIdAndDelete(
      trimmedOfferId
    );

    if (!deletedOffer) {
      return res.status(404).json({ message: "Offer not found." });
    }

    res.status(200).json({ message: "Exchange offer successfully deleted." });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "There was an error deleting the offer." });
  }
};

module.exports = {
  createExchangeOffer: createExchangeOffer,
  getExchangeOffersBySeller: getExchangeOffersBySeller,
  deleteExchangeOfferById: deleteExchangeOfferById
};
