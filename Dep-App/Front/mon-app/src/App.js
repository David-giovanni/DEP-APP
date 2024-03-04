import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./Components/Register";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Navbar from "./Components/Navbar";
import PostAd from "./Components/PostAd";
import Add from "./Components/Add";
import MyAds from "./Components/MyAds";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Navbar" element={<Navbar />} />
          <Route path="/PostAd" element={<PostAd />} />
          <Route path="/Add" element={<Add />} />
          <Route path="/MyAds" element={<MyAds />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
