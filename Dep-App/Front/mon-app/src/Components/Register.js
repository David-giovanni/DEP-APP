import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = () => {
    const formData = { username, email, password };

    fetch("http://localhost:4000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setMessage(data.message);
        if (data.message === "Inscription réussie") {
          console.log("Inscription réussie, redirection vers /login...");
          navigate("/login");
        } else {
          // Compte existe déjà, afficher un message d'erreur
          console.log("Compte déjà existant");
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la requête:", error);
        setMessage("Compte Existant. Veuillez réessayer.");
      });
  };

  const handleGoogleLogin = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse?.credential);

    // Envoyer les informations de l'utilisateur Google à votre serveur
    fetch("http://localhost:4000/googleLogin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ googleUser: decoded }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("La réponse du réseau n'était pas correcte");
        }
        return response.json();
      })
      .then((data) => {
        setMessage(data.message);

        // Supposons que la réponse contienne une propriété 'token'
        const token = data.token;

        // Stocker le jeton dans le stockage local
        localStorage.setItem("token", token);

        console.log(
          "Connexion Google réussie, redirection vers la page d'accueil..."
        );
        // Supposons que vous ayez une page d'accueil à "/"
        navigate("/");
      })
      .catch((error) => {
        console.error("Erreur lors de la connexion Google :", error);
        setMessage("La connexion Google a échoué. Veuillez réessayer.");
      });
  };

  return (
    <div>
      <Navbar />
      <div className="bg-[#242424] flex items-center justify-center min-h-screen">
        <div className="bg-white p-8 shadow-md w-96 rounded-xl">
          <h2 className="text-2xl font-bold mb-4 text-center">Inscription</h2>
          <form>
            <div className="mb-4">
              <label className="block text-gray-600 text-sm font-semibold mb-2">
                Nom d'utilisateur:
              </label>
              <input
                type="text"
                className="w-full border p-2 rounded focus:outline-none focus:border-blue-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-600 text-sm font-semibold mb-2">
                E-mail:
              </label>
              <input
                type="email"
                className="w-full border p-2 rounded focus:outline-none focus:border-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-600 text-sm font-semibold mb-2">
                Mot de passe:
              </label>
              <input
                type="password"
                className="w-full border p-2 rounded focus:outline-none focus:border-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="button"
              onClick={handleRegister}
              className="bg-blue-500 text-white flex mx-auto py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
            >
              S'inscrire
            </button>
            <div className="mt-1 flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => {
                  console.log("Échec de la connexion Google");
                }}
              />
            </div>
            {message && <p className="text-red-500 mt-4">{message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
