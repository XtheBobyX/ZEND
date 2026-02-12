import "../index.css";
import { Link, useNavigate } from "react-router-dom";

import zendLogo from "../assets/img/zend-logo.svg";
import React, { useState } from "react";
import { useAuth } from "../hooks/AuthContext";
import Button from "../components/Button";
import { LiaRandomSolid } from "react-icons/lia";

const API_URL = import.meta.env.VITE_API_URL;

function Register() {
  const navigate = useNavigate();

  // Interface for form values
  interface FormValues {
    username: string;
    password: string;
    repeat_password: string;
  }

  // Form state
  const [formValues, setFormValues] = useState<FormValues>({
    username: "",
    password: "",
    repeat_password: "",
  });

  const handleInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((data) => ({ ...data, [name]: value }));
  };

  const { refreshUser } = useAuth();

  // Submit registration form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (formValues.password !== formValues.repeat_password) {
      alert("Passwords do not match");
      return;
    }

    // Register user
    try {
      const url = `${API_URL}/api/users/register`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formValues.username,
          password: formValues.password,
        }),
      });

      if (!res.ok) {
        alert("Error while registering");
        throw new Error(`HTTP Error: ${res.status}`);
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      await refreshUser();

      navigate("/create-profile", { state: { username: formValues.username } });
    } catch (error) {
      console.error(error);
    }
  };

  // Generate a random username
  const generateRandomUser = async () => {
    const randomUser = `user_${crypto.randomUUID().slice(0, 6)}`;
    setFormValues((prev) => ({ ...prev, username: randomUser }));
  };

  // Generate a default password
  const generatePassword = () => {
    const randomPassword = "1234";
    setFormValues((prev) => ({
      ...prev,
      password: randomPassword,
      repeat_password: randomPassword,
    }));
    alert("The random password is 1234");
  };

  return (
    <div className="flex justify-center items-center min-h-screen mx-6">
      <div className="flex w-full">
        {/* Welcome section */}
        <div className="w-2/5 bg-purple-700 shadow-2xl shadow-purple-500 pt-6 hidden lg:block">
          <p className="text-5xl text-center mt-12">Welcome to</p>
          <img src={zendLogo} alt="App Logo" className="mx-auto my-12 w-40" />
          <p className="text-5xl text-center">ZEND</p>
          <p className="text-center mt-5">
            Don’t miss what’s happening right now!
          </p>
          <p className="text-center mt-2">
            Create your account and join the conversation.
          </p>
        </div>

        {/* Registration form */}
        <div className="w-full lg:w-3/5 bg-[#1B1B1B] border-4 border-purple-700 px-4 shadow-2xl shadow-purple-500">
          <h1 className="text-4xl text-center mt-20 font-zen">REGISTER</h1>
          <p className="text-2xl text-center mt-4">Create a new account!</p>

          <form
            method="POST"
            className="mt-14 block mx-auto text-center"
            onSubmit={handleSubmit}
          >
            {/* Username input */}
            <div className="relative w-80 lg:w-96 mx-auto mb-4">
              <input
                type="text"
                name="username"
                value={formValues.username}
                onChange={handleInputs}
                placeholder="Username"
                className="border w-80 lg:w-96 h-12 rounded-l px-8 mb-4 block mx-auto"
              />
              <LiaRandomSolid
                onClick={generateRandomUser}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer hover:text-purple-600"
              />
            </div>

            {/* Password input */}
            <div className="relative w-80 lg:w-96 mx-auto mb-4">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formValues.password}
                onChange={handleInputs}
                className="border w-80 lg:w-96 h-12 rounded-l px-8 block mx-auto mb-4"
              />
              <LiaRandomSolid
                onClick={generatePassword}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer hover:text-purple-600"
              />
            </div>

            {/* Repeat password input */}
            <div className="relative w-80 lg:w-96 mx-auto mb-4">
              <input
                type="password"
                name="repeat_password"
                placeholder="Repeat Password"
                value={formValues.repeat_password}
                onChange={handleInputs}
                className="border w-80 lg:w-96 h-12 rounded-l px-8 block mx-auto"
              />
              <LiaRandomSolid
                onClick={generatePassword}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer hover:text-purple-600"
              />
            </div>

            <Button
              type="submit"
              className="w-72 md:w-96 md:py-4 my-8 text-2xl bg-purple-700 hover:bg-purple-600"
            >
              Sign Up
            </Button>

            <p className="mb-20">
              Already have an account?{" "}
              <Link to="/login">
                <span className="text-purple-700 hover:text-purple-500">
                  Log in
                </span>
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
