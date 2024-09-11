const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
const port = 4000;

const url = "mongodb://localhost:27017/DEP-APP";

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

MongoClient.connect(url)
  .then((client) => {
    const db = client.db("DEP-APP");
    const usersCollection = db.collection("users");
    const adsCollection = db.collection("ads");

    app.post("/register", async (req, res) => {
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

    app.post("/login", async (req, res) => {
      const { email, password } = req.body;

      const user = await usersCollection.findOne({ email, password });

      if (!user) {
        return res.status(401).json({ message: "Identifiants incorrects" });
      }

      // Generate a token with the secret (replace "your-secret-key" with your own secret key)
      const token = jwt.sign(
        { userId: user._id, email: user.email, username: user.username },
        "your-secret-key",
        {
          expiresIn: "1h",
        }
      );

      // Send the token and username in the response
      res
        .status(200)
        .json({ message: "Connexion réussie", token, username: user.username });
    });

    app.post("/googleLogin", async (req, res) => {
      try {
        const { googleUser } = req.body;

        // Vérifiez si l'utilisateur Google existe déjà dans la base de données
        const existingUser = await usersCollection.findOne({
          email: googleUser.email,
        });

        if (!existingUser) {
          // Si l'utilisateur n'existe pas, enregistrez-le dans la base de données
          await usersCollection.insertOne({
            username: googleUser.name,
            email: googleUser.email,
            // Vous pouvez également enregistrer d'autres informations pertinentes
          });
        }

        // Récupérez l'utilisateur depuis la base de données
        const user = await usersCollection.findOne({ email: googleUser.email });

        // Générez un token avec le secret (remplacez "your-secret-key" par votre propre clé secrète)
        const token = jwt.sign(
          { userId: user._id, email: user.email, username: user.username },
          "your-secret-key",
          {
            expiresIn: "1h",
          }
        );

        // Envoyez le token et le nom d'utilisateur dans la réponse
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

    app.get("/getAds", async (req, res) => {
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

    app.post("/postAd", async (req, res) => {
      try {
        const { title, price, description, location, location2, phone } =
          req.body;

        const token =
          req.headers.authorization && req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, "your-secret-key");

        // Validate that all necessary information is present
        if (
          !title ||
          !price ||
          !description ||
          !location ||
          !location2 ||
          !phone
        ) {
          // Check for phone
          return res.status(400).json({
            message: "Veuillez fournir toutes les informations nécessaires.",
          });
        }

        // Save the ad in the database, associating the user ID
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

        // Get the complete ad without the image path
        const newAd = await adsCollection.findOne({ _id: result.insertedId });

        // Respond with a success message and the details of the created ad
        res.status(201).json({
          message: "Annonce postée avec succès",
          ad: { ...newAd },
        });
      } catch (error) {
        console.error("Erreur lors de la création de l'annonce :", error);
        res.status(500).json({
          message: "Une erreur est survenue lors de la création de l'annonce.",
        });
      }
    });

    const { ObjectId } = require("mongodb");

    app.delete("/deleteAd/:adId", async (req, res) => {
      try {
        const token =
          req.headers.authorization && req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, "your-secret-key");

        // Récupérez l'identifiant de l'annonce et convertissez-le en ObjectId
        const adId = new ObjectId(req.params.adId);

        // Vérifiez si l'annonce appartient à l'utilisateur actuel
        const ad = await adsCollection.findOne({ _id: adId });
        if (!ad) {
          return res.status(404).json({ message: "Annonce non trouvée" });
        }
        if (ad.userId !== decodedToken.userId) {
          return res.status(403).json({
            message: "Vous n'êtes pas autorisé à supprimer cette annonce",
          });
        }

        // Supprimez l'annonce de la base de données
        await adsCollection.deleteOne({ _id: adId });

        res.status(200).json({ message: "Annonce supprimée avec succès" });
      } catch (error) {
        console.error("Erreur lors de la suppression de l'annonce :", error);
        res.status(500).json({
          message:
            "Une erreur est survenue lors de la suppression de l'annonce.",
        });
      }
    });

    app.get("/getUserInfo", async (req, res) => {
      try {
        const token =
          req.headers.authorization && req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, "your-secret-key");

        // Utilisez les informations incluses dans le jeton pour renvoyer les détails de l'utilisateur
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

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((err) =>
    console.error("Erreur de connexion à la base de données", err)
  );
