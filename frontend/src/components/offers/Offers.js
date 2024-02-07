import React, { useState, useEffect } from "react";
import axios from "axios";
import "./css/offers.css";

const Offers = () => {
  const [purchaseOffers, setPurchaseOffers] = useState([]);
  const [exchangeOffers, setExchangeOffers] = useState([]);
  const [renderedPurchaseOffers, setRenderedPurchaseOffers] = useState([]);
  const [renderedExchangeOffers, setRenderedExchangeOffers] = useState([]);
  const [selectedBuyerDetails, setSelectedBuyerDetails] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);

  const fetchPurchaseOffers = async () => {
    try {
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("email");

      const config = {
        method: "get",
        url: `http://localhost:3000/purchaseOffersBySeller:${email}`,
        headers: {
          "x-access-token": token,
        },
      };

      const response = await axios(config);
      setPurchaseOffers(response.data);
    } catch (error) {
      console.error("Error fetching collections:", error);
    }
  };

  useEffect(() => {
    fetchPurchaseOffers();
  }, []);

  const fetchExchangeOffers = async () => {
    try {
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("email");

      const config = {
        method: "get",
        url: `http://localhost:3000/exchangeOffersBySeller:${email}`,
        headers: {
          "x-access-token": token,
        },
      };

      const response = await axios(config);
      setExchangeOffers(response.data);
    } catch (error) {
      console.error("Error fetching collections:", error);
    }
  };

  useEffect(() => {
    fetchExchangeOffers();
  }, []);

  const fetchUserDetails = async (email) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        method: "get",
        url: `http://localhost:3000/user:${email}`,
        headers: {
          "x-access-token": token,
        },
      };

      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error("Error fetching user details:", error);
      return null;
    }
  };

  const fetchExhibitDetails = async (exhibitId) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        method: "get",
        url: `http://localhost:3000/exhibit:${exhibitId}`,
        headers: {
          "x-access-token": token,
        },
      };

      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error("Error fetching exhibit details:", error);
      return null;
    }
  };

  const openContactModal = (buyerDetails) => {
    setSelectedBuyerDetails(buyerDetails);
    setShowContactModal(true);
  };

  const closeContactModal = () => {
    setSelectedBuyerDetails(null);
    setShowContactModal(false);
  };
  const deletePurchaseOffer = async (purchaseOfferId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:3000/purchaseOffer:${purchaseOfferId}`, {
        headers: {
          'x-access-token': token,
        },
      });
      if (response.status === 200) {
        await fetchPurchaseOffers();
      }
    } catch (error) {
      console.error('Error deleting offer: ', error);
    }
  };

  const deleteExchangeOffer = async (exchangeOfferId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:3000/exchangeOffer:${exchangeOfferId}`, {
        headers: {
          'x-access-token': token,
        },
      });
      if (response.status === 200) {
        await fetchExchangeOffers();
      }
    } catch (error) {
      console.error('Error deleting offer: ', error);
    }
  };

  useEffect(() => {
    const renderPurchaseOffers = async () => {
      const offers = await Promise.all(
        purchaseOffers.map(async (offer, index) => {
          const buyerDetails = await fetchUserDetails(offer.buyerEmail);
          const exhibitDetails = await fetchExhibitDetails(offer.exhibitId);

          return (
            <div key={index} className="offer">
              <div className="offerWrapper">
                <div className="buyerInfo">
                  <div className="offerInfoItem" id="user">
                    <span className="offerInfoLabel">User:</span>
                    <span className="offerInfoContent">
                      {buyerDetails ? `${buyerDetails.name} ${buyerDetails.surname}` : 'N/A'}
                    </span>
                  </div>
                  <div className="offerInfoItem" id="price">
                    <span className="offerInfoLabel">Price:</span>
                    <span className="offerInfoContent">{offer.price}€</span>
                  </div>
                  <div className="offerMessage" id="message">
                    <span className="offerInfoLabel">Message:</span>
                    <span className="offerInfoContent" style={{ display: 'block', whiteSpace: 'pre-wrap', maxWidth: '40ch' }}>{offer.message}</span>
                  </div>
                </div>
                <div className="exhibitInfo">
                  <img className="exhibitImageOffer" width={100} height={100} alt="" src={exhibitDetails.image} />
                  <p>{exhibitDetails ? exhibitDetails.name : 'N/A'}</p>
                </div>
              </div>
              <div className="offerButtons">
                <button className="contactButton" onClick={() => openContactModal(buyerDetails)}>Contact</button>
                <button className="declineButton" onClick={() => deletePurchaseOffer(offer._id)}>Decline</button>
              </div>
            </div>
          );
        })
      );

      setRenderedPurchaseOffers(offers);
    };

    renderPurchaseOffers();
  }, [purchaseOffers]);

  useEffect(() => {
    const renderExchangeOffers = async () => {
      const offers = await Promise.all(
        exchangeOffers.map(async (offer, index) => {
          const buyerDetails = await fetchUserDetails(offer.buyerEmail);
          const exhibitDetails = await fetchExhibitDetails(offer.offeredExhibitId);
          const exhibitDetailsBuy = await fetchExhibitDetails(offer.exhibitId);

          return (
            <div key={index} className="offer">
              <div className="buyerInfo">
                <div className="offerInfoItem" id="user">
                  <span className="offerInfoLabel">User:</span>
                  <span className="offerInfoContent">{buyerDetails ? `${buyerDetails.name} ${buyerDetails.surname}` : 'N/A'}</span>
                </div>
                <div className="exhibitInfoExchange">
                  <div className="exhibitToChange">
                    <img className="exhibitImageOffer" width={100} height={100} alt="" src={exhibitDetailsBuy.image} />
                    <p>Exhibit Name: {exhibitDetailsBuy ? exhibitDetailsBuy.name : 'N/A'}</p>
                  </div>
                  <span style={{ fontSize: '36px', color: '#d6be73', fontWeight: 'bold' }}>
                    <i className="fa fa-arrow-right"></i>
                  </span>
                  <div className="exhibitOffered">
                    <img className="exhibitImageOffer" width={100} height={100} alt="" src={exhibitDetails.image} />
                    <p>Offered Exhibit: {exhibitDetails ? exhibitDetails.name : 'N/A'}</p>
                  </div>
                </div>
                <div className="offerMessage" id="message">
                  <span className="offerInfoLabel">Message:</span>
                  <span className="offerInfoContent" style={{ display: 'block', whiteSpace: 'pre-wrap', maxWidth: '40ch' }}>{offer.message}</span>
                </div>
              </div>
              <div className="offerButtons">
                <button className="contactButton" onClick={() => openContactModal(buyerDetails)}>Contact</button>
                <button className="declineButton" onClick={() => deleteExchangeOffer(offer._id)}>Decline</button>
              </div>
            </div>
          );
        })
      );
      setRenderedExchangeOffers(offers);
    };

    renderExchangeOffers();
  }, [exchangeOffers]);

  return (
    <>
      <div className="offersBody">
        <div className="purchaseOffersContainer">
          <div className="offers-container">
            <div className="offersLabel">Purchase offers:</div>
            {renderedPurchaseOffers.length > 0 ? renderedPurchaseOffers : <p>No purchase offers available.</p>}
          </div>
        </div>
        <div className="exchangeOffersContainer">
          <div className="offers-container">
            <div className="offersLabel">Exchange offers:</div>
            {renderedExchangeOffers.length > 0 ? renderedExchangeOffers : <p>No exchange offers available.</p>}
          </div>
        </div>
      </div>

      {showContactModal && (
        <div className="contactModal">
          <div className="contactModalContent">
            <div className="contactModalLabel">
              <h2>Contact</h2>
            </div>
            <div className="contactModalBody">
              <div className="contactModalItem">
                <span className="contactModalInfoLabel">Email:</span>
                <span className="contactModalInfoContent">{selectedBuyerDetails.email}</span>
              </div>
              <div className="contactModalItem">
                <span className="contactModalInfoLabel">Phone Number:</span>
                <span className="contactModalInfoContent">{selectedBuyerDetails.phoneNumber}</span>
              </div>
            </div>
            <span className="closeContactModal" onClick={closeContactModal}>
              &times;
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default Offers;
