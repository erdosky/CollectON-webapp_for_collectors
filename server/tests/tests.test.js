require("dotenv").config();

const request = require("supertest");
const app = require("../server");
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');
const Collection = require('../models/collection');
const Exhibit = require('../models/exhibit');
const PurchaseOffer = require('../models/purchaseOffer');

afterEach(async () => {
    await User.findOneAndDelete({ email: "john.example@example.com" });
    await Collection.findOneAndDelete({ name: "Art Collection" });
    await Exhibit.findOneAndDelete({ name: "Art Exhibit" });
});


describe("create new user", () => {
    it("should create a new user", async () => {
        await User.findOneAndDelete({ email: "john.example@example.com" });

        const newUser = {
            name: "John",
            surname: "Doe",
            email: "john.example@example.com",
            password: "Haslo123",
            phoneNumber: "123456789",
        };

        const registrationResponse = await request(app)
            .post("/registerForm")
            .send(newUser)
            .expect("Content-Type", /json/)
            .expect(200);

        expect(registrationResponse.body.message).toBe("User registered.");
    },);

    it("should return 400 with an appropriate error message for invalid data", async () => {
        const invalidUser = {
            name: "123",
            surname: "Doe",
            email: "invalid_email",
            password: "weak",
            phoneNumber: "invalid_phone",
        };

        request(app)
            .post("/registerForm")
            .send(invalidUser)
            .expect("Content-Type", /json/)
            .expect(400)
            .then((res) => {
                expect(res.body.message).toContain("Invalid");
            });

        await User.findOneAndDelete({ email: "john.example@example.com" });
    });
});

describe('get user by email', () => {
    it('should return user information with a valid token', async () => {
        const testUser = {
            name: "John",
            surname: "Doe",
            email: "john.exa@example.com",
            password: "Haslo123",
            phoneNumber: "123456789",
        };

        const user = new User(testUser);
        await user.save();

        const token = jwt.sign({ email: testUser.email }, testUser.password);

        return request(app)
            .get(`/user:${encodeURIComponent(testUser.email)}`)
            .set('x-access-token', token)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
                expect(res.body.email).toBe(testUser.email);
            });
    });

    it('should return 404 with an invalid email', async () => {
        const token = jwt.sign({ email: 'test@example.com' }, 'Haslo123');

        return request(app)
            .get('/user:invalid_email')
            .set('x-access-token', token)
            .expect('Content-Type', /json/)
            .expect(404)
            .then((res) => {
                expect(res.body.message).toBe('There is no user with given email address.');
            });
    });

    it('should return 401 without a token', async () => {
        return request(app)
            .get('/user:test@example.com')
            .expect('Content-Type', "application/json; charset=utf-8")
            .expect(403)
            .then((res) => {
                expect(res.body.message).toBe('No token provided!');
            });
    });
});

describe('findAllUsers', () => {
    it('should return all users in the database', async () => {
        const token = jwt.sign({ email: 'admin@example.com' }, 'Haslo123');

        return request(app)
            .get('/allUsers')
            .set('x-access-token', token)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
                expect(res.body.length).toBeGreaterThan(1);
            });
    }, 25000);

    it('should return 403 without a token', async () => {
        return request(app)
            .get('/allUsers')
            .expect('Content-Type', "application/json; charset=utf-8")
            .expect(403)
            .then((res) => {
                expect(res.body.message).toBe('No token provided!');
            });
    });
});

describe('updateUserDetails', () => {
    it('should update user profile details successfully', async () => {
        const testUser = {
            name: "John",
            surname: "Doe",
            email: "john.old@example.com",
            password: "Haslo123",
            phoneNumber: "123456789",
        };

        const updatedUserProfileDetails = {
            newName: "Updatedjohn",
            newSurname: "Updateddoe",
            country: "Newcountry",
            bio: "Updatedbio",
            profileImage: "updated_image_url.jpg",
            userEmail: testUser.email,
        };

        const user = new User(testUser);
        await user.save();

        const token = jwt.sign({ email: testUser.email }, testUser.password);

        return request(app)
            .put('/user/profile/update')
            .set('x-access-token', token)
            .send(updatedUserProfileDetails)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
                expect(res.body.message).toBe('User details updated successfully.');

                User.findOne({ email: testUser.email }).then((updatedUser) => {
                    expect(updatedUser.name).toBe(updatedUserProfileDetails.newName);
                    expect(updatedUser.surname).toBe(updatedUserProfileDetails.newSurname);
                    expect(updatedUser.country).toBe(updatedUserProfileDetails.country);
                    expect(updatedUser.bio).toBe(updatedUserProfileDetails.bio);
                    expect(updatedUser.profileImage).toBe(updatedUserProfileDetails.profileImage);
                });
            });
    });


    it('should return 400 for mismatched passwords', async () => {
        const testUser = {
            name: "John",
            surname: "Doe",
            email: "john.exa@example.com",
            password: "Haslo123",
            phoneNumber: "123456789",
        };

        const updatedUserDetails = {
            newPassword: "NewPassword123",
            confirmPassword: "MismatchedPassword"
        };

        const user = new User(testUser);
        await user.save();

        const token = jwt.sign({ email: testUser.email }, testUser.password);

        return request(app)
            .put('/user/update')
            .set('x-access-token', token)
            .send(updatedUserDetails)
            .expect('Content-Type', "application/json; charset=utf-8")
            .expect(400)
            .then((res) => {
                expect(res.body.message).toBe('Passwords aren\'t the same.');
            });
    });
});

const secretKey = "Haslo123";

describe('createCollection', () => {
    it('should create a new collection', async () => {
        await Collection.findOneAndDelete({ name: "Art Collection" });
        const newCollection = {
            name: "Art Collection",
            description: "A collection of beautiful artworks",
            type: "Art",
            email: "user@example.com",
            image: "collection_image.jpg",
        };

        const token = jwt.sign({ email: newCollection.email }, secretKey);

        return request(app)
            .post("/collectionForm")
            .set('x-access-token', token)
            .send(newCollection)
            .expect("Content-Type", /json/)
            .expect(200)
            .then((res) => {
                expect(res.body.message).toBe("Collection added.");
            });
    });

    it('should return 400 for missing name and description', async () => {
        const invalidCollection = {
            type: "Art",
            email: "user@example.com",
            image: "collection_image.jpg",
        };

        const token = jwt.sign({ email: invalidCollection.email }, secretKey);

        request(app)
            .post("/collectionForm")
            .set('x-access-token', token)
            .send(invalidCollection)
            .expect("Content-Type", /json/)
            .expect(400)
            .then((res) => {
                expect(res.body.message).toBe("Name and description are required.");
            });
        await Collection.findOneAndDelete({ name: "Art Collection" });
    });
});

describe('findAllUserCollections', () => {
    it('should return collections for a specific user', async () => {
        const ownerEmail = "albert@gmail.com";

        const token = jwt.sign({ email: ownerEmail }, secretKey);

        return request(app)
            .get(`/getUserCollections:albert@gmail.com`)
            .set('x-access-token', token)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
                expect(res.body.length).toBeGreaterThan(0);
            });
    }, 15000);
});

describe('findAllCollections', () => {
    it('should return all collections', async () => {
        const token = jwt.sign({ email: 'admin@example.com' }, secretKey);

        return request(app)
            .get('/getAllCollections')
            .set('x-access-token', token)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
                expect(res.body.length).toBeGreaterThan(0);
            });
    }, 15000);
});

describe('deleteCollectionById', () => {
    it('should delete a collection by ID', async () => {
        const token = jwt.sign({ email: 'albert@gmail.com' }, secretKey);

        const newCollection = {
            name: "Art Collection",
            description: "A collection of beautiful artworks",
            type: "Art",
            email: "user@example.com",
            image: "collection_image.jpg",
        };

        const collection = new Collection(newCollection);
        await collection.save();

        const collectionId = collection._id;

        return request(app)
            .delete(`/collection/delete:${collectionId}`)
            .set('x-access-token', token)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
                expect(res.body.message).toBe("Collection successfully deleted.");
            });
    });
});

describe('getAllExhibitsByCollectionId', () => {
    it('should return all exhibits for a specific collection', async () => {
        const token = jwt.sign({ email: 'albert@gmail.com' }, secretKey);

        return request(app)
            .get(`/getAllCollectionExhibits:6599648c54d479c93c91940c`)
            .set('x-access-token', token)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
                expect(res.body.exhibits.length).toBeGreaterThan(0);
                expect(res.body.collectionName).toBeDefined();
            });
    }, 15000);
});

describe('createExhibit', () => {
    it('should create a new exhibit', async () => {
        await Exhibit.findOneAndDelete({ name: "Art Exhibit" });
        const newExhibit = {
            name: "Art Exhibit",
            description: "A beautiful art piece",
            year: "2022",
            state: "Excellent",
            collectionId: "656bd0519a2bcfce12c02021",
            image: "exhibit_image.jpg",
            toSold: false,
        };

        const token = jwt.sign({ email: 'albert@gmail.com' }, secretKey);

        request(app)
            .post("/exhibitForm")
            .set('x-access-token', token)
            .send(newExhibit)
            .expect("Content-Type", /json/)
            .expect(200)
            .then((res) => {
                expect(res.body.message).toBe("Exhibit added.");
            });
        await Exhibit.findOneAndDelete({ name: "Art Exhibit" });
    });

    it('should return 400 for invalid exhibit data', async () => {
        const invalidExhibit = {
            name: "Invalid Exhibit",
            description: 123,
            year: "2022",
            state: "Bad",
            collectionId: "invalid_collection_id",
            image: "exhibit_image.jpg",
            toSold: false,
        };

        const token = jwt.sign({ email: 'albert@gmail.com' }, secretKey);

        return request(app)
            .post("/exhibitForm")
            .set('x-access-token', token)
            .send(invalidExhibit)
            .expect("Content-Type", /json/)
            .expect(400)
            .then((res) => {
                expect(res.body.message).toContain("Invalid");
            });
    });
});

describe('deleteExhibit', () => {
    it('should delete an exhibit by ID', async () => {
        const newExhibit = {
            name: "Art Exhibit",
            description: "A beautiful art piece",
            year: "2022",
            state: "Excellent",
            collectionId: "656bd0519a2bcfce12c02021",
            image: "exhibit_image.jpg",
            toSold: false,
        };

        const exhibit = new Exhibit(newExhibit);
        await exhibit.save();

        const exhibitId = exhibit._id;

        const token = jwt.sign({ email: 'albert@gmail.com' }, secretKey);

        return request(app)
            .delete(`/exhibit/delete:${exhibitId}`)
            .set('x-access-token', token)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
                expect(res.body.message).toBe("Exhibit deleted successfully.");
            });
    });

    it('should return 404 for non-existing exhibit ID', async () => {
        const token = jwt.sign({ email: 'albert@gmail.com' }, secretKey);
        const fakeCollectionId = new mongoose.Types.ObjectId().toString();

        return request(app)
            .delete(`/exhibit/delete:${fakeCollectionId}`)
            .set('x-access-token', token)
            .expect('Content-Type', "application/json; charset=utf-8")
            .expect(404)
            .then((res) => {
                expect(res.body.message).toBe("Exhibit not found.");
            });
    });
});

describe('findCollectionOwnerByExhibitId', () => {
    it('should return the owner email of the collection associated with an exhibit', async () => {
        const newExhibit = {
            name: "Art Exhibit",
            description: "A beautiful art piece",
            year: "2022",
            state: "Excellent",
            collectionId: "656bd0519a2bcfce12c02021",
            image: "exhibit_image.jpg",
            toSold: false,
        };

        const exhibit = new Exhibit(newExhibit);
        await exhibit.save();

        const exhibitId = exhibit._id;

        const token = jwt.sign({ email: 'albert@gmail.com' }, secretKey);

        request(app)
            .get(`/findCollectionOwnerByExhibitId:${exhibitId}`)
            .set('x-access-token', token)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
                expect(res.body.ownerEmail).toBeDefined();
            });

        Exhibit.findOneAndDelete({ _id: newExhibit._id })
    });

    it('should return 404 for non-existing exhibit ID', async () => {
        const token = jwt.sign({ email: 'albert@gmail.com' }, secretKey);

        const fakeCollectionId = new mongoose.Types.ObjectId().toString();

        return request(app)
            .get(`/findCollectionOwnerByExhibitId:${fakeCollectionId}`)
            .set('x-access-token', token)
            .expect('Content-Type', /json/)
            .expect(404)
            .then((res) => {
                expect(res.body.message).toBe("Exhibit not found");
            });
    });
});

describe('findAllExhibitsForUser', () => {
    it('should return exhibits for a specific user', async () => {
        const userWithEmail = "ernest@gmail.com";

        const token = jwt.sign({ email: userWithEmail }, secretKey);

        return request(app)
            .get(`/findAllExhibitsForUser:${userWithEmail}`)
            .set('x-access-token', token)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
                expect(res.body.length).toBeGreaterThan(0);
            });
    }, 15000);

    it('should return 404 for user with no collections', async () => {
        const testUser = {
            name: "John",
            surname: "Doe",
            email: "userWithNoCollections@example.com",
            password: "Haslo123",
            phoneNumber: "123456789",
        };

        const user = new User(testUser);
        await user.save();

        const token = jwt.sign({ email: "albert@gmail.com" }, secretKey);

        request(app)
            .get(`/findAllExhibitsForUser:userWithNoCollections@example.com`)
            .set('x-access-token', token)
            .expect('Content-Type', /json/)
            .expect(404)
            .then((res) => {
                expect(res.body.message).toBe("No collections found for this user.");
            });
        User.findOneAndDelete({ email: "userWithNoCollections@example.com" })
    });
});

describe('getExhibitById', () => {
    it('should return exhibit by ID', async () => {
        const newExhibit = {
            name: "Art Exhibit",
            description: "A beautiful art piece",
            year: "2022",
            state: "Excellent",
            collectionId: "656bd0519a2bcfce12c02021",
            image: "exhibit_image.jpg",
            toSold: false,
        };

        const exhibit = new Exhibit(newExhibit);
        await exhibit.save();

        const exhibitId = exhibit._id;

        const token = jwt.sign({ email: 'albert@gmail.com' }, secretKey);

        return request(app)
            .get(`/exhibit:${exhibitId}`)
            .set('x-access-token', token)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
                expect(res.body._id).toBeDefined();
            });
    });

    it('should return 404 for non-existing exhibit ID', async () => {
        const token = jwt.sign({ email: 'albert@gmail.com' }, secretKey);
        const fakeCollectionId = new mongoose.Types.ObjectId().toString();

        return request(app)
            .get(`/exhibit:${fakeCollectionId}`)
            .set('x-access-token', token)
            .expect('Content-Type', /json/)
            .expect(404)
            .then((res) => {
                expect(res.body.message).toBe("Exhibit not found");
            });
    });
});

describe('createPurchaseOffer', () => {
    it('should create a new purchase offer', async () => {
        await PurchaseOffer.findOneAndDelete({ message: "Test message" });
        const token = jwt.sign({ email: 'albert@gmail.com' }, secretKey);

        const newPurchaseOffer = {
            buyerEmail: "albert@gmail.com",
            sellerEmail: "ernest@gmail.com",
            price: "1999",
            message: "Test message",
            exhibitId: "65646ff534b9e3af16e41776",
        };

        const response = await request(app)
            .post('/purchaseOfferForm')
            .set('x-access-token', token)
            .send(newPurchaseOffer)
            .expect('Content-Type', /json/)
            .expect(404);
        expect(response.body.message).toBe('Exhibit with given id not found.');
        await PurchaseOffer.findOneAndDelete({ message: "Test message" });
    });
});

describe('getPurchaseOffersBySeller', () => {
    it('should get purchase offers by seller', async () => {
        const token = jwt.sign({ email: 'albert@gmail.com' }, secretKey);

        const response = await request(app)
            .get(`/purchaseOffersBySeller:albert@gmail.com`)
            .set('x-access-token', token)
            .expect('Content-Type', /json/)
            .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
    });
});