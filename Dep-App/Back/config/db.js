const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017/DEP-APP";
let db = null;

const connectDB = async () => {
  if (db) return db;
  try {
    const client = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = client.db("DEP-APP");
    return db;
  } catch (err) {
    console.error("Erreur de connexion à la base de données", err);
    throw err;
  }
};

module.exports = connectDB;
