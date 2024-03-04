const express = require("express");
const { MongoClient } = require("mongodb");

const router = express.Router();

const url = "mongodb://localhost:27017/DEP-APP";

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((client) => {
    const db = client.db("DEP-APP");
    const adsCollection = db.collection("ads");

    router.get("/", async (req, res) => {
      try {
        const ads = await adsCollection.find().toArray();
        res.status(200).json(ads);
      } catch (error) {
        console.error("Erreur lors de la récupération des annonces :", error);
        res.status(500).json({
          message:
            "Une erreur est survenue lors de la récupération des annonces.",
        });
      }
    });
  })
  .catch((err) =>
    console.error("Erreur de connexion à la base de données", err)
  );

module.exports = router;
