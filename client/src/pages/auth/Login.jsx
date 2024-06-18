import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserRoleContext } from "../../contexts/userRoleContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import bikeVideo from './bike-5491275-4574321.mp4';
import favicon from '../../../public/vihaan_honda_logo.png';

const Login = () => {
    const { setUserRole } = useContext(UserRoleContext);
    const [obj, setObj] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({
        email: false
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;

        setObj((prev) => ({ ...prev, [name]: value }));

        const validationRegex = {
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        };

        if (name === "email") {
            const emailValid = validationRegex.email.test(value);
            setErrors((prevErrors) => ({ ...prevErrors, email: !emailValid }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const res = await axios.post("/api/auth/login", obj, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await res.data;
            if (data.status === 200) {
                const userId = data.id;
                localStorage.setItem("uid", userId);
                setUserRole(data.role);
                localStorage.setItem("li", true);
                if (data.role === "admin") {
                    localStorage.setItem("role", "9087-t1-vaek-123-riop");
                } else if (data.role === "engineer") {
                    localStorage.setItem("role", "2069-t2-prlo-456-fiok");
                } else if (data.role === "manager") {
                    localStorage.setItem("role", "5001-t4-maek-101-znop");
                } else if (data.role === "supervisor") {
                    localStorage.setItem("role", "6002-t5-saek-202-kiop");
                } else if (data.role === "accounts") {
                    localStorage.setItem("role", "7003-t6-laek-303-jiop");
                } else {
                    localStorage.setItem("role", "4032-t3-raek-789-chop");
                }
                navigate(`/user/${userId}/tickets`);
            } else if (data.status === 404) {
                toast.error("Please check your email id or password.");
            } else if (data.status === 401) {
                toast.error("Please check your email id or password.");
            }
        } catch (err) {
            console.error(err);
        }
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

    const inputClasses = (field) => {
        const baseClasses = "block w-full px-5 py-3 text-base text-gray-800 placeholder-gray-500 transition duration-500 ease-in-out transform border rounded-lg bg-gray-100 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-offset-2";
        const value = obj[field];
        let focusClasses = "focus:ring-blue-500"; // Default focus ring color

        const validationRegex = {
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        };

        if (validationRegex[field]) {
            if (validationRegex[field].test(value)) {
                focusClasses = "focus:ring-green-500";
            } else if (value.length > 0) {
                focusClasses = "focus:ring-red-500";
            }
        }

        const errorClasses = errors[field] ? "border-red-500" : "border-transparent";

        return `${baseClasses} ${focusClasses} ${errorClasses}`;
    };

    return (
        <>
            <style>{keyframes}</style>
            <form onSubmit={handleSubmit} className="flex justify-center items-center h-screen bg-while">
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
                                                Login
                                            </h3>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 space-y-2">
                                    <div>
                                        <label htmlFor="email" className="sr-only">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={obj.email}
                                            name="email"
                                            className={inputClasses("email")}
                                            placeholder="Enter your email"
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
                                            className="block w-full px-5 py-3 text-base text-gray-800 placeholder-gray-500 transition duration-500 ease-in-out transform border rounded-lg bg-gray-100 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            placeholder="Enter your password"
                                            onChange={handleChange}
                                            autoComplete="current-password"
                                        />
                                    </div>
                                    <div className="flex flex-col mt-4 lg:space-y-2">
                                        <button
                                            type="submit"
                                            className="flex items-center justify-center w-full px-10 py-4 text-base font-medium text-center text-white transition duration-500 ease-in-out transform bg-vihaan-honda-red rounded-xl hover:bg-vihaan-honda-red-darker focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                        >
                                            Login
                                        </button>
                                        <br />
                                        <span
                                            href="#"
                                            type="button"
                                            className="inline-flex justify-center py-4 text-base font-medium text-gray-500 focus:outline-none hover:text-gray-600 focus:text-red-600 sm:text-sm"
                                        >
                                            Not signed up?
                                            <Link
                                                to="/register"
                                                style={{
                                                    color: "red",
                                                    marginLeft: "0.3em",
                                                    marginRight: "0.25em",
                                                }}
                                            >
                                                Signup
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
                                <div className="text-center">
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

export default Login;