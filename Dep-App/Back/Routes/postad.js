const express = require("express");
const { MongoClient } = require("mongodb");
const jwt = require("jsonwebtoken");

const router = express.Router();

const url = "mongodb://localhost:27017/DEP-APP";

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((client) => {
    const db = client.db("DEP-APP");
    const adsCollection = db.collection("ads");
    const usersCollection = db.collection("users");

    router.post("/", async (req, res) => {
      try {
        const { title, price, description, location } = req.body;
        const token =
          req.headers.authorization && req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, "your-secret-key");

        if (!title || !price || !description || !location) {
          return res.status(400).json({
            message: "Veuillez fournir toutes les informations nécessaires.",
          });
        }

        // Ajoutez une vérification pour s'assurer que l'utilisateur existe
        const user = await usersCollection.findOne({
          _id: decodedToken.userId,
        });

        if (!user) {
          return res.status(404).json({
            message: "Utilisateur non trouvé.",
          });
        }

        const result = await adsCollection.insertOne({
          title,
          price,
          description,
          location,
          userId: decodedToken.userId,
          email: user.email,
          username: user.username,
        });

        res.status(201).json({
          message: "Annonce postée avec succès",
          adId: result.insertedId,
        });
      } catch (error) {
        console.error("Erreur lors de la création de l'annonce :", error);
        res.status(500).json({
          message: "Une erreur est survenue lors de la création de l'annonce.",
        });
      }
    });
  })
  .catch((err) =>
    console.error("Erreur de connexion à la base de données", err)
  );

module.exports = router;
