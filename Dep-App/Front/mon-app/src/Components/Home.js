import React from "react";
import Navbar from "./Navbar";

import Add from "./Add";

const Home = () => {
  return (
    <div className="bg-[#242424] min-h-screen">
      <Navbar />
      <button className="bg-blue-500 hover:bg-blue-600 hover:duration-500 flex mx-auto mt-10 rounded-xl px-20 py-2 font-bold">
        <a href="/PostAd">Déposer une annonce +</a>
      </button>
      <Add />
    </div>
  );
};

export default Home;
