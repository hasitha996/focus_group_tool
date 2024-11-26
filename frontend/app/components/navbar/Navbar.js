"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserIcon } from "@heroicons/react/24/solid";  
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";  

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // Decrypt user data from cookies
  useEffect(() => {
    const encryptedUserData = Cookies.get("userData");
    if (encryptedUserData) {
      try {
        const bytes = CryptoJS.AES.decrypt(
          encryptedUserData,
          process.env.ENCRYPTION_KEY || "default_key"
        );
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        setUser(decryptedData); // Set user data
      } catch (error) {
        console.error("Failed to decrypt user data", error);
      }
    }
  }, []);

  // Handle Logout
  const handleLogout = () => {
    Cookies.remove("userData");
    router.push("/login");
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-white text-2xl font-semibold">
          <Link href="/">Focus Group tool </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8">
          <Link href="/" className="text-white hover:text-blue-200">
            Home
          </Link>
          <Link href="/dashboard" className="text-white hover:text-blue-200">
            Dashboard
          </Link>
         
        </div>

        {/* Profile and Logout */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {/* Profile Icon and User Info */}
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <UserIcon className="w-8 h-8 text-white" />

                  {/* <img src={user.avatarUrl || '/default-avatar.png'} alt="Profile" className="w-8 h-8 rounded-full"/> */}
                </div>
                <span className="text-white">{user.email}</span>
              </div>

              <button
                onClick={handleLogout}
                className="text-white hover:text-red-300 focus:outline-none"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="text-white hover:text-blue-200">
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden ${isOpen ? "block" : "hidden"} bg-blue-700 mt-4`}
      >
        <Link
          href="/"
          className="block text-white py-2 px-4 hover:bg-blue-500"
          onClick={() => setIsOpen(false)}
        >
          Home
        </Link>
        <Link
          href="/dashboard"
          className="block text-white py-2 px-4 hover:bg-blue-500"
          onClick={() => setIsOpen(false)}
        >
          Dashboard
        </Link>
        
      </div>
    </nav>
  );
};

export default Navbar;
