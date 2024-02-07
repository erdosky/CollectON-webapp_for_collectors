const Collection = require("../models/collection");
const Exhibit = require("../models/exhibit");

const createCollection = async (req, res) => {
  const name = req.body.name;
  const type = req.body.type;
  const description = req.body.description;
  const email = req.body.email;
  const image = req.body.image;

  if (!name || !description) {
    return res
      .status(400)
      .json({ message: "Name and description are required." });
  }

  const nameAndDescriptionRegex = /^[A-Za-ząćęłńóśźżĄĆĘŁŃÓŚŹŻ0-9,. -]+$/;

  if (
    !nameAndDescriptionRegex.test(name) ||
    !nameAndDescriptionRegex.test(description)
  ) {
    return res.status(400).json({
      message:
        "Name and description must contain only letters, commas, periods, hyphens, and spaces.",
    });
  }

  const newCollection = new Collection({
    name: name,
    description: description,
    type: type,
    ownerEmail: email,
    image: image,
    likes: 0
  });

  newCollection.save().then(() => {
    return res.status(200).json({ message: "Collection added." });
  });
};

const findAllUserCollections = async (req, res) => {
  try {
    const ownerEmail = req.params.ownerEmail;
    const trimmedOwnerEmail = ownerEmail.replace(":", "");

    const collections = await Collection.find({
      ownerEmail: trimmedOwnerEmail,
    });

    res.json(collections);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "There was an error" });
  }
};

const findAllCollections = async (req, res) => {
  try {
    const collections = await Collection.find({});

    res.json(collections);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "There was an error" });
  }
};

const findAllCollectionsExceptByEmail = async (req, res) => {
  const ownerEmail = req.params.ownerEmail;
  const trimmedOwnerEmail = ownerEmail.replace(":", "");
  try {
    const collections = await Collection.find({ ownerEmail: { $ne: trimmedOwnerEmail } });

    res.json(collections);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "There was an error" });
  }
};

const deleteCollectionById = async (req, res) => {
  try {
    const collectionId = req.params.collectionId;
    const trimmedCollectionId = collectionId.replace(":", "");

    const deletedCollection = await Collection.findByIdAndDelete(
      trimmedCollectionId
    );

    if (!deletedCollection) {
      return res.status(404).json({ message: "Collection not found." });
    }
    await Exhibit.deleteMany({
      collectionId: trimmedCollectionId,
    });


    res.status(200).json({ message: "Collection successfully deleted." });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "There was an error deleting the collection." });
  }
};

const getAllExhibitsByCollectionId = async (req, res) => {
  try {
    const collectionId = req.params.collectionId;
    const trimmedCollectionId = collectionId.replace(":", "");
    const collection = await Collection.findById(trimmedCollectionId);
    if (!collection) {
      return res.status(404).json({ message: "Collection not found." });
    }

    const exhibits = await Exhibit.find({ collectionId: trimmedCollectionId });

    if (exhibits.length === 0) {
      return res
        .status(404)
        .json({ message: "No exhibits found for this collection." });
    }

    res.json({ exhibits, collectionName: collection.name });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "There was an error retrieving the exhibits." });
  }
};

module.exports = {
  createCollection: createCollection,
  findAllUserCollections: findAllUserCollections,
  deleteCollectionById: deleteCollectionById,
  findAllCollections: findAllCollections,
  getAllExhibitsByCollectionId: getAllExhibitsByCollectionId,
  findAllCollectionsExceptByEmail: findAllCollectionsExceptByEmail,
};
