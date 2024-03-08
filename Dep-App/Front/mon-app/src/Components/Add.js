// Add.js
import React, { useState, useEffect } from "react";

const Add = () => {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await fetch("http://localhost:4000/getAds");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("Ads from backend:", data);
        setAds(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des annonces :", error);
      }
    };

    fetchAds();
  }, []);

  return (
    <div className="mt-8 text-white px-5 xl:px-20">
      <h3 className="text-2xl font-bold mb-4 text-white">
        Annonces disponibles :
      </h3>
      <ul className="xl:grid xl:grid-cols-3 grid grid-cols-1 xl:gap-5">
        {ads.map((ad) => (
          <li
            key={ad._id}
            className="bg-[#161616] hover hover:scale-105 duration-300 p-4 mb-2 rounded-xl"
          >
            <div className="mt-2 flex items-center">
              <span className="text-blue-500 font-bold mr-2">Titre :</span>
              <span>{ad.title}</span>
            </div>
            <div className="mt-2 flex items-center">
              <span className="text-blue-500 font-bold mr-2">
                Description :
              </span>
              <span>{ad.description}</span>
            </div>
            <div className="mt-2 flex items-center">
              <span className="text-blue-500 font-bold mr-2">Prix :</span>
              <span>{ad.price} €</span>
            </div>
            <div className="mt-2 flex items-center">
              <span className="text-blue-500 font-bold mr-2">
                Lieu de départ :
              </span>
              <span>{ad.location}</span>
            </div>
            <div className="mt-2 flex items-center">
              <span className="text-blue-500 font-bold mr-2">
                Lieu d'arrivée :
              </span>
              <span>{ad.location2}</span>
            </div>
            <div className="mt-2 flex items-center">
              <span className="text-blue-500 font-bold mr-2">Telephone :</span>
              <span>{ad.phone}</span>
            </div>
            <span className="text-gray-500">
              Annonce posté par : {ad.username}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Add;
