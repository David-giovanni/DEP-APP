const express = require("express");
const { MongoClient } = require("mongodb");
const jwt = require("jsonwebtoken");

const router = express.Router();

const url = "mongodb://localhost:27017/DEP-APP";

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((client) => {
    const db = client.db("DEP-APP");
    const usersCollection = db.collection("users");

    router.get("/", async (req, res) => {
      try {
        const token =
          req.headers.authorization && req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, "your-secret-key");

        const user = await usersCollection.findOne({
          _id: decodedToken.userId,
        });

        res.status(200).json({
          userId: decodedToken.userId,
          username: decodedToken.username,
          email: decodedToken.email,
        });
      } catch (error) {
        console.error("Error fetching user information:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });
  })
  .catch((err) =>
    console.error("Erreur de connexion à la base de données", err)
  );

module.exports = router;
