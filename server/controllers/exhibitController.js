const Exhibit = require("../models/exhibit");
const Collection = require("../models/collection");

const createExhibit = async (req, res) => {
  const name = req.body.name;
  const description = req.body.description;
  const year = req.body.year;
  const state = req.body.state;
  const collectionId = req.body.collectionId;
  const image = req.body.image;
  const toSold = req.body.toSold;

  if (!name || name.length < 3 || !/^[a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s!@#$%^&*(),.?":{}|<>-]+$/.test(name)) {
    return res.status(400).json({ message: "Invalid name." });
  }

  if (!description || typeof description !== "string") {
    return res.status(400).json({ message: "Invalid description." });
  }

  if (!state || !/^[a-zA-Z ]+$/.test(state)) {
    return res.status(400).json({ message: "Invalid state." });
  }

  const collection = await Collection.findById({ _id: collectionId });

  if (!collection) {
    return res
      .status(404)
      .json({ message: "Collection with given id not found." });
  }

  const newExhibit = new Exhibit({
    name: name,
    description: description,
    year: year,
    state: state,
    collectionId: collectionId,
    image: image,
    toSold: toSold,
  });

  newExhibit.save().then(() => {
    return res.status(200).json({ message: "Exhibit added." });
  });
};

const deleteExhibit = async (req, res) => {
  const exhibitId = req.params.id;
  const trimmedExhibitId = exhibitId.replace(":", "");
  try {
    const exhibit = await Exhibit.findById(trimmedExhibitId);

    if (!exhibit) {
      return res.status(404).json({ message: "Exhibit not found." });
    }

    await Exhibit.findByIdAndDelete(trimmedExhibitId);
    res.status(200).json({ message: "Exhibit deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "An error occurred.", error: error });
  }
};

const findCollectionOwnerByExhibitId = async (req, res) => {
  const exhibitId = req.params.id;
  const trimmedExhibitId = exhibitId.replace(":", "");
  try {
    const exhibit = await Exhibit.findById(trimmedExhibitId);

    if (!exhibit) {
      return res.status(404).json({ message: "Exhibit not found" });
    }

    const collection = await Collection.findById(exhibit.collectionId);

    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    res.json({ ownerEmail: collection.ownerEmail });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "There was an error" });
  }
};

const findAllExhibitsForUser = async (req, res) => {
  try {
    const ownerEmail = req.params.email;
    const trimmedOwnerEmail = ownerEmail.replace(":", "");

    const collections = await Collection.find({
      ownerEmail: trimmedOwnerEmail,
    });

    if (!collections || collections.length === 0) {
      return res.status(404).json({ message: "No collections found for this user." });
    }

    const allExhibits = [];

    for (const collection of collections) {
      const exhibits = await Exhibit.find({ collectionId: collection._id });

      if (exhibits && exhibits.length > 0) {
        allExhibits.push(...exhibits);
      }
    }

    if (allExhibits.length === 0) {
      return res.status(404).json({ message: "No exhibits found for this user." });
    }

    res.json(allExhibits);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "There was an error" });
  }
};

const getExhibitById = async (req, res) => {
  const exhibitId = req.params.id;
  const trimmedExhibitId = exhibitId.replace(":", "");

  try {
    const exhibit = await Exhibit.findById(trimmedExhibitId);

    if (!exhibit) {
      return res.status(404).json({ message: "Exhibit not found" });
    }

    res.json(exhibit);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "There was an error" });
  }
};


module.exports = {
  createExhibit: createExhibit,
  deleteExhibit: deleteExhibit,
  findCollectionOwnerByExhibitId: findCollectionOwnerByExhibitId,
  findAllExhibitsForUser: findAllExhibitsForUser,
  getExhibitById: getExhibitById
};
