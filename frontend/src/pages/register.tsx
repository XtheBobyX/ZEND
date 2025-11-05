import "../index.css";
import { Link, useNavigate } from "react-router-dom";
//

import zendLogo from "../assets/img/zend-logo.svg";
import React, { useState } from "react";
import { useAuth } from "../hooks/AuthContext";
const API_URL = import.meta.env.VITE_API_URL;

function Register() {
  const navigate = useNavigate();

  // Interfaz
  interface FormValues {
    username: string;
    password: string;
    repeat_password: string;
  }

  // Formulario
  const [formValues, setFormValues] = useState<FormValues>({
    username: "",
    password: "",
    repeat_password: "",
  });

  const handleInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((data) => ({ ...data, [name]: value }));
  };
  const { refrescarUsuario } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (formValues.password !== formValues.repeat_password) {
      alert("Las contraseña no coinciden");
      return;
    }

    // Registrar usuario
    try {
      const res = await fetch(`${API_URL}/api/usuarios/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formValues.username,
          password: formValues.password,
        }),
      });

      if (!res.ok) {
        alert("Error al registrarse ");
        throw new Error(`Error HTTP: ${res.status}`);
      }
      const data = await res.json();
      localStorage.setItem("token", data.token);
      await refrescarUsuario();

      navigate("/crear-perfil", { state: { username: formValues.username } });
    } catch (error) {
      console.error(error);
      console.error(API_URL);
    }
  };

  return (
    <div className="w-[90%] flex mx-auto lg:my-12">
      <div className="w-2/5  bg-purple-700 shadow-2xl shadow-purple-500 pt-6 hidden lg:block">
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
          {" "}
          Crea tu cuenta y únete a la conversación.
        </p>
      </div>
      <div className="w-full lg:w-3/5 bg-[#1B1B1B] border-4 border-purple-700 px-4 shadow-2xl shadow-purple-500">
        <h1 className="text-4xl text-center mt-20 font-zen">REGISTRATE</h1>
        <p className="text-2xl text-center mt-4">Create una nueva cuenta !</p>

        <form
          action=""
          method="post"
          className="mt-14 block mx-auto text-center"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name="username"
            value={formValues.username}
            onChange={handleInputs}
            placeholder="Nombre de usuario"
            className="border w-80 lg:w-96 h-12 rounded-l px-8 mb-4 block mx-auto"
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formValues.password}
            onChange={handleInputs}
            className="border w-80 lg:w-96 h-12 rounded-l px-8 block mx-auto mb-4"
          />{" "}
          <input
            type="password"
            name="repeat_password"
            placeholder="Repetir Contraseña"
            value={formValues.repeat_password}
            onChange={handleInputs}
            className="border w-80 lg:w-96 h-12 rounded-l px-8 block mx-auto"
          />
          <input
            type="submit"
            value="Entrar"
            className="w-80 lg:w-96 py-3 rounded-3xl my-4 text-xl bg-purple-700 hover:bg-purple-600 cursor-pointer"
          />
          <p className="mb-20">
            Ya tienes una cuenta ?{" "}
            <Link to="/login">
              <span className="text-purple-700 hover:text-purple-500">
                Inicia
              </span>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
