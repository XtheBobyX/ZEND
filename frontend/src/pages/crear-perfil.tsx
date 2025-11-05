import "../index.css";
import fondoPortada from "../../src/assets/img/background.jpg";
import avatar from "../../src/assets/img/avatar-default.svg";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

function Crear_Perfil() {
  const navigate = useNavigate();
  const location = useLocation();

  // Interfaz del perfil
  interface perfilI {
    portada: string;
    avatar: string;
    nombre_completo: string;
    biografia: string;
  }

  // Estado del Formulario
  const [perfil, setPerfil] = useState<perfilI>({
    portada: fondoPortada,
    avatar: avatar,
    nombre_completo: "",
    biografia: "",
  });

  // Extraer username desde location.state
  const { username } = location.state || "";

  const handleInputs = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    // actualizar datos
    setPerfil((data) => ({ ...data, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/api/usuarios/${username}/perfil`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          nombre_completo: perfil.nombre_completo,
          biografia: perfil.biografia,
          portada: perfil.portada,
          avatar: perfil.avatar,
        }),
      });

      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

      navigate("/");
    } catch (error) {
      console.error("Error al crear el perfil:", error);
    }
  };

  const previewFiles = (file: File, who: "portada" | "avatar") => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setPerfil((prev) => ({ ...prev, [who]: reader.result }));
    };
  };

  const handleFilesUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    who: "portada" | "avatar"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "zend_preset");
    data.append("cloud_name", "dcauxh61z");

    setPerfil((prev) => ({ ...prev, [who]: data }));
    previewFiles(file, who);
  };

  return (
    <>
      <div className="text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-center mt-8">
          Ya estás Logueado
        </h1>
        <p className="text-2xl md:text-3xl mt-6">
          Genial! Solo necesitas un paso más
        </p>
        <p className="text-xl mt-4 ">
          Tu perfil está casi listo. ¡personalízalo y empieza!
        </p>

        <div className="flex justify-center">
          <form
            action=""
            onSubmit={handleSubmit}
            className="lg:w-1/3 md:w-2/3 rounded-xl border border-white mt-8 md:mt-16"
          >
            <div className="relative">
              <div>
                <label htmlFor="portada">
                  <img
                    src={perfil.portada}
                    alt="Fondo de portada"
                    className="rounded-xl w-full h-auto object-cover"
                  />
                </label>
                <input
                  type="file"
                  id="portada"
                  onChange={(e) => handleFilesUpload(e, "portada")}
                  accept="image/png, image/jpg , image/jpeg, image/jfif"
                  className="hidden"
                />
              </div>
              <div>
                <label htmlFor="avatar">
                  <img
                    src={perfil.avatar}
                    alt="Avatar"
                    className="w-32 h-32 border-2 border-white rounded-full absolute left-1/2 transform -translate-x-1/2 bottom-1/4 cursor-pointer object-cover"
                  />
                </label>
                <input
                  type="file"
                  id="avatar"
                  onChange={(e) => handleFilesUpload(e, "avatar")}
                  accept="image/png, image/jpg , image/jpeg, image/jfif"
                  className="hidden"
                />
              </div>
            </div>
            <div className="text-left mt-8">
              <div className="pl-8 mr-4">
                <label
                  htmlFor="nombre_completo"
                  className="text-xl md:text-2xl"
                >
                  Nombre Completo
                </label>
                <input
                  type="text"
                  name="nombre_completo"
                  id="nombre_completo"
                  className="border border-white py-4  md:py-6 rounded-2xl w-full mt-4 pl-4 text-xl"
                  onChange={handleInputs}
                />
              </div>
              <div className="pl-8 mt-8 mr-4">
                <label htmlFor="biografia" className="text-xl md:text-2xl">
                  Biografia
                </label>
                <textarea
                  name="biografia"
                  id="biografia"
                  className="border border-white rounded-2xl w-full h-40  mt-8 pt-4 pl-4 text-xl md:h-60"
                  onChange={handleInputs}
                ></textarea>
              </div>
              <input
                type="submit"
                value="Crear Perfil"
                className="w-11/12 ml-8 py-4 rounded-3xl my-4 md:my-8 text-xl bg-purple-700 hover:bg-purple-600 cursor-pointer"
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Crear_Perfil;
