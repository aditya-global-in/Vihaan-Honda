import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import bikeVideo from './bike-5491275-4574321.mp4';
import favicon from '../../../public/vihaan_honda_logo.png';

const Register = () => {
  const [obj, setObj] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    role: "user",
  });

  const registerUser = async (event) => {
    event.preventDefault();
    const userId = generateUserId();
    try {
      const response = await axios.post(
        "/api/auth/register",
        { ...obj, userId },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      if (data.error) {
        toast.error(data.error);
      } else if (data.status === 200) {
        toast.success("Your account has been created! Please login.");
      }

      setObj({
        name: "",
        phone: "",
        email: "",
        password: "",
        role: "user",
      });
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  const generateUserId = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");

    const uniqueCode = Math.floor(Math.random() * 10000);
    const userId = `${year}${month}${day}${uniqueCode}`;

    return userId;
  };

  const handleChange = (e) => {
    setObj((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const keyframes = `
    @keyframes moveBike {
      0% {
        transform: translateX(-200px);
      }
      100% {
        transform: translateX(100vw);
      }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <form onSubmit={registerUser} className="flex justify-center items-center h-screen bg-while">
        <div className="relative px-4 py-12 mx-auto max-w-7xl sm:px-6 md:px-12 lg:px-24 lg:py-24">
          <div className="absolute inset-0 overflow-hidden">
            <video
              className="bike"
              style={{
                position: "absolute",
                width: "200px",
                height: "auto",
                animation: "moveBike 12s linear infinite",
              }}
              autoPlay
              loop
              muted
              src={bikeVideo}
              type="video/mp4"
            ></video>
          </div>
          <div className="relative z-10 justify-center mx-auto text-left align-bottom transition-all transform bg-gray-300 rounded-lg sm:align-middle sm:max-w-2xl sm:w-full mt-12">
            <div className="grid flex-wrap items-center justify-center grid-cols-1 mx-auto shadow-xl lg:grid-cols-2 rounded-xl">
              <div className="w-full px-6 py-3">
                <div>
                  <div className="mt-3 text-left sm:mt-5">
                    <div className="inline-flex items-center w-full">
                      <h3 className="text-lg font-bold text-gray-800 leading-6 lg:text-5xl">
                        Sign Up
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <div>
                    <label htmlFor="name" className="sr-only">
                      Name
                    </label>
                    <input
                      type="name"
                      value={obj.name}
                      name="name"
                      className="block w-full px-5 py-3 text-base text-gray-800 placeholder-gray-500 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-100 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      placeholder="Enter your name."
                      onChange={handleChange}
                      autoComplete="username"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="sr-only">
                      Phone
                    </label>
                    <input
                      type="phone"
                      value={obj.phone}
                      name="phone"
                      className="block w-full px-5 py-3 text-base text-gray-800 placeholder-gray-500 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-100 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      placeholder="Enter your phone number."
                      onChange={handleChange}
                      autoComplete="phone"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="sr-only">
                      Email
                    </label>
                    <input
                      type="email"
                      value={obj.email}
                      name="email"
                      className="block w-full px-5 py-3 text-base text-gray-800 placeholder-gray-500 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-100 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      placeholder="Enter your email."
                      onChange={handleChange}
                      autoComplete="username"
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="sr-only">
                      Password
                    </label>
                    <input
                      type="password"
                      value={obj.password}
                      name="password"
                      className="block w-full px-5 py-3 text-base text-gray-800 placeholder-gray-500 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-100 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      placeholder="Enter your password."
                      onChange={handleChange}
                      autoComplete="current-password"
                    />
                  </div>
                  <div className="flex flex-col mt-4 lg:space-y-2">
                    <button
                      type="submit"
                      className="flex items-center justify-center w-full px-10 py-4 text-base font-medium text-center text-white transition duration-500 ease-in-out transform bg-vihaan-honda-red rounded-xl hover:bg-vihaan-honda-red-darker focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Sign Up
                    </button>
                    <br />
                    <span
                      href="#"
                      type="button"
                      className="inline-flex justify-center py-4 text-base font-medium text-gray-500 focus:outline-none hover:text-gray-600 focus:text-red-600 sm:text-sm"
                    >
                      Already signed up?
                      <Link
                        to="/login"
                        style={{
                          color: "red",
                          marginLeft: "0.3em",
                          marginRight: "0.25em",
                        }}
                      >
                        Login
                      </Link>
                      here.
                    </span>
                  </div>
                </div>
              </div>
              <div className="order-first lg:block hidden w-full">
                <div
                  className="flex items-center justify-center p-4 rounded-l-lg"
                  style={{ height: '100%' }}
                >
                  <div
                    className="rounded-full overflow-hidden bg-vihaan-honda-red"
                    style={{
                      width: '200px',
                      height: '200px',
                      padding: '10px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <img
                      src={favicon}
                      alt="Vihaan Honda"
                      style={{ width: '100%', height: 'auto' }}
                    />
                  </div>
                </div>
                <div className="text-center mt-4">
                  <p className="text-lg font-bold text-gray-800">By Vihaan Enterprises</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default Register;