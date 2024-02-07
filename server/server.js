const express = require('express');
const cors = require('cors');
const tokenVerification = require('./middleware/tokenVerification.js');
require('./database/connectToDb');

const userController = require("./controllers/userController");
const collectionController = require("./controllers/collectionController");
const exhibitController = require("./controllers/exhibitController");
const purchaseOfferController = require("./controllers/purchaseOfferController");
const exchangeOfferController = require("./controllers/exchangeOfferController");

const app = express();
app.use(express.json({ limit: '25mb' }))
app.use(express.urlencoded({ limit: '25mb', extended: true }));

app.use(cors());


app.post('/registerForm', userController.createUser);
app.post('/loginForm', userController.loginUser);
app.get('/user:email', tokenVerification, userController.findUserByEmail);
app.post('/tokenVerification', userController.verificateUser);
app.put('/user/update', tokenVerification, userController.updateUserDetails);
app.put('/user/profile/update', tokenVerification, userController.updateUserProfileDetails);
app.delete('/user:email', tokenVerification, userController.deleteUserByEmail);
app.get('/allUsers', tokenVerification, userController.findAllUsers);

app.get('/getUserCollections:ownerEmail', tokenVerification, collectionController.findAllUserCollections);
app.get('/getAllCollectionsExceptUser:ownerEmail', tokenVerification, collectionController.findAllCollectionsExceptByEmail)
app.get('/getAllCollections', tokenVerification, collectionController.findAllCollections);
app.get('/getAllCollectionExhibits:collectionId', tokenVerification, collectionController.getAllExhibitsByCollectionId);
app.delete('/collection/delete:collectionId', tokenVerification, collectionController.deleteCollectionById);
app.post('/collectionForm', tokenVerification, collectionController.createCollection);


app.get('/findCollectionOwnerByExhibitId:id', tokenVerification, exhibitController.findCollectionOwnerByExhibitId);
app.get('/findAllExhibitsForUser:email', tokenVerification, exhibitController.findAllExhibitsForUser);
app.get('/exhibit:id', tokenVerification, exhibitController.getExhibitById);
app.post('/exhibitForm', tokenVerification, exhibitController.createExhibit);
app.delete('/exhibit/delete:id', tokenVerification, exhibitController.deleteExhibit);


app.post('/purchaseOfferForm', tokenVerification, purchaseOfferController.createPurchaseOffer);
app.get('/purchaseOffersBySeller:email', tokenVerification, purchaseOfferController.getPurchaseOffersBySeller);
app.delete('/purchaseOffer:id', tokenVerification, purchaseOfferController.deletePurchaseOfferById);

app.post('/exchangeOfferForm', tokenVerification, exchangeOfferController.createExchangeOffer);
app.get('/exchangeOffersBySeller:email', tokenVerification, exchangeOfferController.getExchangeOffersBySeller);
app.delete('/exchangeOffer:id', tokenVerification, exchangeOfferController.deleteExchangeOfferById);

var server = app.listen(3000);

module.exports = server