const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const connectDB = require("../config/db");

const register = async (req, res) => {
  const { username, email, password } = req.body;
  const db = await connectDB();
  const usersCollection = db.collection("users");

  const existingUser = await usersCollection.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ message: "Cet e-mail est déjà enregistré." });
  }

  await usersCollection.insertOne({ username, email, password });
  res.status(201).json({ message: "Inscription réussie" });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const db = await connectDB();
  const usersCollection = db.collection("users");

  const user = await usersCollection.findOne({ email, password });

  if (!user) {
    return res.status(401).json({ message: "Identifiants incorrects" });
  }

  const token = jwt.sign(
    { userId: user._id, email: user.email, username: user.username },
    "your-secret-key",
    { expiresIn: "1h" }
  );

  res
    .status(200)
    .json({ message: "Connexion réussie", token, username: user.username });
};

const googleLogin = async (req, res) => {
  try {
    const { googleUser } = req.body;
    const db = await connectDB();
    const usersCollection = db.collection("users");

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
      { expiresIn: "1h" }
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
};

const getUserInfo = async (req, res) => {
  try {
    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "your-secret-key");

    res.status(200).json({
      userId: decodedToken.userId,
      username: decodedToken.username,
      email: decodedToken.email,
    });
  } catch (error) {
    console.error("Error fetching user information:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { register, login, googleLogin, getUserInfo };
