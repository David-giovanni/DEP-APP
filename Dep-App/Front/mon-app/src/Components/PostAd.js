import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";

const PostAd = ({ onPost }) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [location2, setLocation2] = useState("");
  const [, setAds] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(true);

  const isPhoneNumberValid = (phoneNumber) => {
    // Use a regular expression to validate the phone number format (10 digits)
    const phoneNumberRegex = /^\d{10}$/;
    return phoneNumberRegex.test(phoneNumber);
  };

  const handlePostAd = async () => {
    try {
      if (
        title &&
        price &&
        description &&
        location &&
        location2 &&
        isPhoneNumberValid(phone)
      ) {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("Token non disponible.");
          return;
        }

        const response = await fetch("http://localhost:4000/postAd", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            price,
            description,
            location,
            location2,
            phone,
          }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        console.log(data.message);

        if (onPost) {
          onPost(data.adId);
        }

        setTitle("");
        setPrice("");
        setDescription("");
        setLocation("");
        setLocation2("");
        setMessage("Annonce publiée avec succès !");
      } else {
        console.log("Veuillez remplir toutes les informations de l'annonce.");
      }
    } catch (error) {
      console.error("Erreur lors de la création de l'annonce :", error);
      setMessage(
        "Erreur lors de la création de l'annonce. Veuillez réessayer."
      );
    }
  };

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className="bg-[#242424] min-h-screen">
      <Navbar />
      {isLoggedIn ? (
        <div className="bg-[#161616] text-black rounded-xl mt-10 p-8 xl:w-96 xl:justify-center xl:mx-auto shadow-md">
          <h3 className="text-2xl font-bold mb-4 text-purple-500 text-center">
            Poster une annonce
          </h3>
          <div className="mb-4">
            <label className="block text-white text-sm font-semibold mb-2">
              Titre :
            </label>
            <input
              type="text"
              className="w-full border p-2 rounded focus:outline-none focus:border-purple-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-semibold mb-2">
              Prix :
            </label>
            <input
              type="number"
              className="w-full border p-2 rounded focus:outline-none focus:border-purple-500"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-semibold mb-2">
              Description :
            </label>
            <textarea
              className="w-full border p-2 rounded focus:outline-none focus:border-purple-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-semibold mb-2">
              Lieu de départ :
            </label>
            <input
              type="text"
              className="w-full border p-2 rounded focus:outline-none focus:border-purple-500"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-semibold mb-2">
              Lieu d'arrivée :
            </label>
            <input
              type="text"
              className="w-full border p-2 rounded focus:outline-none focus:border-purple-500"
              value={location2}
              onChange={(e) => setLocation2(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-semibold mb-2">
              Téléphone :
            </label>
            <input
              type="tel"
              className={`w-full border p-2 rounded focus:outline-none focus:border-purple-500 ${
                isPhoneValid ? "" : "border-red-500"
              }`}
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                // Check phone number validity on each change
                setIsPhoneValid(isPhoneNumberValid(e.target.value));
              }}
            />
            {!isPhoneValid && (
              <p className="text-red-500">
                Veuillez entrer un numéro de téléphone valide.
              </p>
            )}
          </div>
          <button
            onClick={handlePostAd}
            className="bg-purple-500 text-white py-2 px-4 rounded-xl mx-auto flex hover:bg-purple-600 hover:duration-500 focus:outline-none focus:shadow-outline-blue active:bg-purple-800"
          >
            Poster l'annonce
          </button>
          {message && <p className="text-green-500">{message}</p>}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-screen text-white text-center">
          <p className="px-10">
            Bonjour ! Connectez-vous ou créez un compte pour déposer votre
            annonce.
          </p>
          <button className="bg-purple-500 hover:bg-purple-600 hover:duration-500 mt-10 rounded-xl py-2 px-10 w-60 font-bold">
            <a href="/login">Me connecter</a>
          </button>
          <button className="border border-x-1 hover:border-purple-500 hover:duration-500 mt-1 rounded-xl py-2 px-10 w-60 font-bold">
            <a href="/register">Créer un compte</a>
          </button>
        </div>
      )}
    </div>
  );
};

export default PostAd;
