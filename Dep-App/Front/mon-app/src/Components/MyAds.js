import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";

const MyAds = () => {
  const [userAds, setUserAds] = useState([]);
  const [token, setToken] = useState(""); // State pour stocker le token

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        setToken(token); // Stocke le token dans le state
        const response = await axios.get("http://localhost:4000/getUserInfo", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userId = response.data.userId;

        const adsResponse = await axios.get("http://localhost:4000/getAds", {
          params: { userId },
        });

        const userAds = adsResponse.data.filter((ad) => ad.userId === userId);

        setUserAds(userAds);
      } catch (error) {
        console.error("Error fetching user information or ads:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleDeleteAd = async (adId) => {
    try {
      await axios.delete(`http://localhost:4000/deleteAd/${adId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserAds(userAds.filter((ad) => ad._id !== adId));
    } catch (error) {
      console.error("Error deleting ad:", error);
    }
  };

  return (
    <div className="bg-[#242424] min-h-screen">
      <Navbar />
      <div className="max-w-2xl mx-auto p-6 ">
        <h1 className="text-3xl text-white font-bold mb-6">Mes Annonces</h1>
        {/* Bouton pour afficher le token */}
        <button
          onClick={() => alert(token)} // Affiche le token dans une alerte
          className="bg-blue-500 text-white py-2 px-4 rounded mb-4"
        >
          Afficher le Token
        </button>
        {userAds.map((ad) => (
          <div key={ad._id} className="bg-white rounded-xl p-4 mb-4">
            <h2 className="text-2xl font-bold text-purple-500 mb-2">
              Titre : {ad.title}
            </h2>
            <p className="text-gray-700">Titre : {ad.title}</p>
            <p className="text-gray-700">Lieu de départ : {ad.location}</p>
            <p className="text-gray-700">Lieu d'arrivée : {ad.location2}</p>
            <p className="text-gray-700">Descriptions : {ad.description}</p>
            <p className="text-gray-700">Prix : {ad.price} €</p>
            <p className="text-gray-700">Téléphone : {ad.phone}</p>

            <button
              onClick={() => handleDeleteAd(ad._id)} // Supprimer l'annonce en cliquant sur le bouton
              className="bg-red-500 text-white py-2 px-4 rounded mt-2"
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAds;
