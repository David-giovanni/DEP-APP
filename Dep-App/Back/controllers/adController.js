const jwt = require("jsonwebtoken");
const connectDB = require("../config/db");

const getAds = async (req, res) => {
  try {
    const db = await connectDB();
    const adsCollection = db.collection("ads");
    const ads = await adsCollection.find().toArray();
    res.status(200).json(ads);
  } catch (error) {
    console.error("Erreur lors de la récupération des annonces :", error);
    res.status(500).json({
      message: "Une erreur est survenue lors de la récupération des annonces.",
    });
  }
};

const postAd = async (req, res) => {
  try {
    const { title, price, description, location, location2, phone } = req.body;
    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "your-secret-key");

    if (!title || !price || !description || !location || !location2 || !phone) {
      return res.status(400).json({
        message: "Veuillez fournir toutes les informations nécessaires.",
      });
    }

    const db = await connectDB();
    const adsCollection = db.collection("ads");
    const result = await adsCollection.insertOne({
      title,
      price,
      description,
      location,
      location2,
      phone,
      userId: decodedToken.userId,
      email: decodedToken.email,
      username: decodedToken.username,
    });

    const newAd = await adsCollection.findOne({ _id: result.insertedId });
    res
      .status(201)
      .json({ message: "Annonce postée avec succès", ad: { ...newAd } });
  } catch (error) {
    console.error("Erreur lors de la création de l'annonce :", error);
    res.status(500).json({
      message: "Une erreur est survenue lors de la création de l'annonce.",
    });
  }
};

const deleteAd = async (req, res) => {
  try {
    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "your-secret-key");

    const adId = req.params.adId;
    const db = await connectDB();
    const adsCollection = db.collection("ads");

    const ad = await adsCollection.findOne({ _id: ObjectId(adId) });
    if (!ad) {
      return res.status(404).json({ message: "Annonce non trouvée" });
    }
    if (ad.userId !== decodedToken.userId) {
      return res.status(403).json({
        message: "Vous n'êtes pas autorisé à supprimer cette annonce",
      });
    }

    await adsCollection.deleteOne({ _id: ObjectId(adId) });
    res.status(200).json({ message: "Annonce supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'annonce :", error);
    res.status(500).json({
      message: "Une erreur est survenue lors de la suppression de l'annonce.",
    });
  }
};

module.exports = { getAds, postAd, deleteAd };
