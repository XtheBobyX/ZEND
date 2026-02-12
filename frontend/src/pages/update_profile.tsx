import "../index.css";
import cover from "../../src/assets/img/background.jpg";
import avatarDefault from "../../src/assets/img/avatar-default.svg";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../components/Button";

const API_URL = import.meta.env.VITE_API_URL;

interface Profile {
  cover: string;
  avatar: string;
  full_name: string;
  biography: string;
}

function Update_Profile() {
  const navigate = useNavigate();
  const location = useLocation();

  const { username } = (location.state as { username: string }) || {};

  const [profile, setProfile] = useState<Profile>({
    cover: cover,
    avatar: avatarDefault,
    full_name: username,
    biography: "",
  });

  useEffect(() => {
    const getAvatarAndCover = async () => {
      const res = await fetch(`${API_URL}/api/users/username/${username}`);
      const json = await res.json();

      if (json.avatar) setProfile((prev) => ({ ...prev, avatar: json.avatar }));
      if (json.cover) setProfile((prev) => ({ ...prev, cover: json.cover }));
    };

    getAvatarAndCover();
  }, [username]);

  // INPUTS
  const handleInputs = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  //
  const previewImage = (file: File, who: "cover" | "avatar") => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setProfile((prev) => ({
        ...prev,
        [who]: reader.result as string,
      }));
    };
  };

  const handleFilesUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    who: "cover" | "avatar",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    previewImage(file, who);
  };

  //
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username) {
      console.error("Username no recibido");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/users/${username}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          full_name: profile.full_name,
          biography: profile.biography,
          cover: profile.cover,
          avatar: profile.avatar,
        }),
      });

      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

      navigate("/");
    } catch (error) {
      console.error("Error al crear el perfil:", error);
    }
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
              {/* Cover */}
              <div>
                <label htmlFor="cover">
                  <img
                    src={profile.cover}
                    alt="Fondo de cover"
                    className="rounded-xl w-full h-auto object-cover"
                  />
                </label>
                <input
                  type="file"
                  id="cover"
                  onChange={(e) => handleFilesUpload(e, "cover")}
                  accept="image/png, image/jpg , image/jpeg, image/jfif"
                  className="hidden"
                />
              </div>
              {/* Avatar */}
              <div>
                <label htmlFor="avatar">
                  <img
                    src={profile.avatar}
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
                <label htmlFor="full_name" className="text-xl md:text-2xl">
                  Nombre Completo
                </label>
                <input
                  value={profile.full_name}
                  type="text"
                  name="full_name"
                  id="full_name"
                  className="border border-white py-4  md:py-6 rounded-2xl w-full mt-4 pl-4 text-xl"
                  onChange={handleInputs}
                />
              </div>
              <div className="pl-8 mt-8 mr-4">
                <label htmlFor="biography" className="text-xl md:text-2xl">
                  Biografia
                </label>
                <textarea
                  name="biography"
                  id="biography"
                  className="border border-white rounded-2xl w-full h-40  mt-8 pt-4 pl-4 text-xl md:h-60"
                  onChange={handleInputs}
                />
              </div>

              <Button
                type="submit"
                className="w-11/12 ml-8 py-4 rounded-3xl my-4 md:my-8  bg-purple-700 hover:bg-purple-600"
              >
                Enviar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Update_Profile;
