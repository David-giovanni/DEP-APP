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
      const { username, email, password } = req.body;

      const existingUser = await usersCollection.findOne({ email });

      if (existingUser) {
        return res
          .status(400)
          .json({ message: "Cet e-mail est déjà enregistré." });
      }

      await usersCollection.insertOne({ username, email, password });

      res.status(201).json({ message: "Inscription réussie" });
    });
  })
  .catch((err) =>
    console.error("Erreur de connexion à la base de données", err)
  );

module.exports = router;
