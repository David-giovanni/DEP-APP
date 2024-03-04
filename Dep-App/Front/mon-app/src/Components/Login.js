import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null); // Stocker les informations de l'utilisateur
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const token = localStorage.getItem("token");
    if (token) {
      // Récupérer les informations de l'utilisateur en utilisant le jeton
      fetch("http://localhost:4000/getUserInfo", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setUser(data);
        })
        .catch((error) => {
          console.error(
            "Erreur lors de la récupération des informations de l'utilisateur :",
            error
          );
        });
    }
  }, []);

  const handleLogin = () => {
    const formData = { email, password };

    fetch("http://localhost:4000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
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

        console.log("Connexion réussie, redirection vers la page d'accueil...");
        // Supposons que vous ayez une page d'accueil à "/"
        navigate("/");
      })
      .catch((error) => {
        console.error("Erreur lors de la requête :", error);
        setMessage("Identifiants incorrects. Veuillez réessayer."); // Mettre à jour l'état avec un message d'erreur
      });
  };

  const handleLogout = () => {
    // Supprimer le jeton du stockage local et réinitialiser les informations de l'utilisateur
    localStorage.removeItem("token");
    setUser(null);
    setMessage("Vous avez été déconnecté.");
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
    <div className="">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-[#242424]">
        <div className="bg-white p-8 shadow-md w-96 rounded-xl">
          {user ? (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">
                Bienvenue, {user.username}
              </h2>
              <p>Email : {user.email}</p>
              <button
                type="button"
                onClick={handleLogout}
                className="mt-4 bg-red-500 text-white py-2 px-4 mx-auto flex rounded hover:bg-red-600 focus:outline-none focus:shadow-outline-red active:bg-red-800"
              >
                Se déconnecter
              </button>
              <button
                onClick={() => navigate("/MyAds")}
                type="button"
                className="mt-1 bg-blue-500 text-white py-2 px-4 mx-auto flex rounded focus:outline-none focus:shadow-outline-red active:bg-blue-800"
              >
                Mes annonces
              </button>
            </div>
          ) : (
            <div className="rounded-none">
              <h2 className="text-2xl font-bold mb-4 text-center">Connexion</h2>
              <form>
                <div className="mb-4">
                  <label className="block text-gray-600 text-sm font-semibold mb-2">
                    E-mail :
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
                    Mot de passe :
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
                  onClick={handleLogin}
                  className="bg-blue-500 text-white flex mx-auto py-2 px-[77px] rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
                >
                  Se connecter
                </button>
                <div className="mt-1 flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    onError={() => {
                      console.log("Échec de la connexion Google");
                    }}
                  />
                </div>
                {message && (
                  <p className="text-red-500 mt-4 text-center">{message}</p>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
