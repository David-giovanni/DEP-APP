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
      const { email, password } = req.body;

      const user = await usersCollection.findOne({ email, password });

      if (!user) {
        return res.status(401).json({ message: "Identifiants incorrects" });
      }

      const token = jwt.sign(
        { userId: user._id, email: user.email, username: user.username },
        "your-secret-key",
        {
          expiresIn: "1h",
        }
      );

      res
        .status(200)
        .json({ message: "Connexion réussie", token, username: user.username });
    });
  })
  .catch((err) =>
    console.error("Erreur de connexion à la base de données", err)
  );

module.exports = router;
