const express = require("express");
const { MongoClient } = require("mongodb");
const jwt = require("jsonwebtoken");

const router = express.Router();

const url = "mongodb://localhost:27017/DEP-APP";

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((client) => {
    const db = client.db("DEP-APP");
    const usersCollection = db.collection("users");

    router.post("/", async (req, res) => {
      try {
        const { googleUser } = req.body;

        const existingUser = await usersCollection.findOne({
          email: googleUser.email,
        });

        if (!existingUser) {
          await usersCollection.insertOne({
            username: googleUser.name,
            email: googleUser.email,
          });
        }

        const user = await usersCollection.findOne({ email: googleUser.email });

        const token = jwt.sign(
          { userId: user._id, email: user.email, username: user.username },
          "your-secret-key",
          {
            expiresIn: "1h",
          }
        );

        res.status(200).json({
          message: "Connexion Google réussie",
          token,
          username: user.username,
        });
      } catch (error) {
        console.error("Erreur lors de la connexion Google :", error);
        res.status(500).json({
          message: "Une erreur est survenue lors de la connexion Google.",
        });
      }
    });
  })
  .catch((err) =>
    console.error("Erreur de connexion à la base de données", err)
  );

module.exports = router;
