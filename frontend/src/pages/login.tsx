import "../index.css";
import { Link, useNavigate } from "react-router";

import zendLogo from "../assets/img/zend-logo.svg";
import { useState } from "react";
import { useAuth } from "../hooks/AuthContext";
import Button from "../components/Button";
const API_URL = import.meta.env.VITE_API_URL;

function Login() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const handleInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((data) => ({ ...data, [name]: value }));
  };

  const { refreshUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validaciones
    try {
      const res = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user.username,
          password: user.password,
        }),
      });

      if (!res.ok) {
        alert("Error while attempting to log in");
        throw new Error(`Error HTTP: ${res.status} ,`);
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      await refreshUser();
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen mx-6">
      <div className="flex w-full ">
        {/* Welcome Screen */}
        <div className="lg:block w-2/5 hidden bg-purple-700 shadow-2xl shadow-purple-500 pt-6  ">
          <p className="text-5xl text-center mt-12">Bienvenido a</p>
          <img
            src={zendLogo}
            alt="Logo de la app"
            className="mx-auto my-12 w-40"
          />
          <p className="text-5xl text-center">ZEND</p>
          <p className="text-center mt-5">
            ¡No te pierdas lo que está pasando en este momento!
          </p>
          <p className="text-center mt-2">
            Inicia sesión y sé parte de la conversación.
          </p>
        </div>
        {/* Form Screen */}
        <div className="lg:w-3/5 w-full  bg-[#1B1B1B] border-4 border-purple-700 px-4 shadow-2xl shadow-purple-500">
          <h1 className="text-4xl text-center mt-20 font-zen">INICIA SESIÓN</h1>
          <p className="text-2xl text-center mt-4">Bienvenido de nuevo !</p>
          <form
            method="post"
            className="mt-14 block mx-auto text-center"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Nombre de usuario"
              className="border w-72 md:w-96 h-12 md:h-16 rounded-l px-8 mb-6 block mx-auto"
              onChange={handleInputs}
            />
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Contraseña"
              className="border w-72 md:w-96 h-12 md:h-16 rounded-l px-8 block mx-auto"
              onChange={handleInputs}
            />

            <Button
              type="submit"
              className="w-72 md:w-96 md:py-4 my-8 text-2xl bg-purple-700 hover:bg-purple-600 "
            >
              Entrar
            </Button>
            <p className="mb-20">
              No tienes una cuenta ?{" "}
              <Link to="/register">
                <span className="text-purple-700 hover:text-purple-500">
                  Registraté
                </span>
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
