import React, { useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { FaHome, FaLockOpen } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const navigate = useNavigate();

  const handleNav = () => {
    setNav(!nav);
  };

  const handleLogout = () => {
    // Efface le token du localStorage
    localStorage.removeItem("token");

    // Redirige l'utilisateur vers la page de connexion (ou une autre page appropriée)
    navigate("/login");
  };

  return (
    <div className="bg-[#161616] xl:h-14 flex justify-between items-center text-white relative">
      <div className="md:flex md:justify-center md:items-center"></div>
      <div
        onClick={handleNav}
        className={`block md:hidden py-2 pl-2 ${nav ? "ml-60" : "mr-auto"}`}
      >
        {nav ? <AiOutlineClose size={30} /> : <AiOutlineMenu size={30} />}
      </div>
      <ul
        className={
          nav
            ? "fixed left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#141518] ease-in-out duration-500 z-50 flex flex-col justify-between"
            : "ease-in-out duration-300 fixed top-[-100%]"
        }
      >
        <div>
          <a
            className="flex justify-center items-center pt-3 md:hidden"
            href="/"
          >
            <img className="w-32 md:hidden" alt="" />
          </a>
        </div>
        <div>
          <li className="p-4 border-b border-yellow-200 hover:bg-black text-white text-center font-bold">
            <a href="/">Home</a>
          </li>
          <li className="p-4 border-b border-yellow-200 mt-96 hover:bg-black text-white text-center font-bold">
            <a href="Login">LOGIN</a>
          </li>
          <li className="p-4 border-yellow-200 hover:bg-black text-white text-center font-bold">
            <a href="Register">REGISTER</a>
          </li>
        </div>
      </ul>
      <div className="flex-grow md:text-transparent lg:text-transparent xl:text-transparent gap-40 xl:mx-auto justify-center font-bold flex items-center">
        <div className="text-white hidden xl:block">
          <a
            href="/"
            className="xl:text-gray-300 xl:hover:border-b xl:border-transparent xl:hover:border-blue-500 xl:hover:text-white xl:px-4 xl:py-3 xl:rounded-xl xl:flex xl:gap-2"
            style={{ transition: "border 0.5s" }}
          >
            <FaHome className="" size={25} />
            Home
          </a>
        </div>
        <div className="text-white hidden xl:block">
          <a
            href="login"
            className="xl:text-gray-300 xl:hover:border-b xl:border-transparent xl:hover:border-blue-500 xl:hover:text-white xl:px-4 xl:py-3 xl:rounded-xl xl:flex xl:gap-2"
            style={{ transition: "border 1s" }}
          >
            <FaLockOpen className="" size={25} />
            Login
          </a>
        </div>
        <div className="text-white hidden xl:block">
          <a
            href="register"
            className="xl:text-gray-300 xl:hover:border-b xl:border-transparent xl:hover:border-blue-500 xl:hover:text-white xl:px-4 xl:py-3 xl:rounded-xl xl:flex xl:gap-2"
            style={{ transition: "border 1s" }}
          >
            <CgProfile className="" size={25} />
            Register
          </a>
        </div>
      </div>
      {localStorage.getItem("token") && (
        <button className="text-green-500 mr-2 mt-1" onClick={handleLogout}>
          °
        </button>
      )}
    </div>
  );
};

export default Navbar;
