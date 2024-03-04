import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";

const MyAds = () => {
  const [userAds, setUserAds] = useState([]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
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

  return (
    <div className="bg-[#242424] min-h-screen">
      <Navbar />
      <div className="max-w-2xl mx-auto p-6 ">
        <h1 className="text-3xl text-white font-bold mb-6">Mes Annonces</h1>
        {userAds.map((ad) => (
          <div key={ad._id} className="bg-white rounded-xl p-4 mb-4">
            <h2 className="text-2xl font-bold text-blue-500 mb-2">
              Titre : {ad.title}
            </h2>
            <p className="text-gray-700">Descriptions : {ad.description}</p>
            <p className="text-gray-700">Lieu : {ad.location}</p>
            <img
              src={`http://localhost:4000/${ad.image}`}
              alt={ad.title}
              className="w-60 h-40 rounded"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAds;
