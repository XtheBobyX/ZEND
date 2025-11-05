import { useEffect, useState } from "react";
import Nav_left from "../components/nav-left";
import { obtenerIdToken, obtenerUsuarioById } from "../utils/functions";
import avatarDefault from "../../src/assets/img/avatar-default.svg";
import { FiArrowLeft } from "react-icons/fi";
import { Link, useLocation } from "react-router";
import { VscSend } from "react-icons/vsc";
import { TbPencilPlus } from "react-icons/tb";
import { IoClose } from "react-icons/io5";
import Menu_mobile from "../components/Menu-mobile";
const API_URL = import.meta.env.VITE_API_URL;
import { useSocket } from "../hooks/socketContext";

function Mensajes() {
  const [listaUsuarios, setListadoUsuarios] = useState<any>([]);
  const [mensajes, setMensajes] = useState<any[]>([]);

  const [myID, setMyID] = useState(obtenerIdToken());
  const [contenido, setContenido] = useState("");

  const [receptor, setReceptor] = useState();
  const [modalAbierto, setModalAbierto] = useState(false);

  const [busquedaUsuario, setBusquedaUsuarios] = useState([]);
  const [view, setView] = useState(false);

  const location = useLocation();
  const userID = location.state?.id;

  const socket = useSocket();
  const toggleModal = () => setModalAbierto((prev) => !prev);

  const obtenerListado = async () => {
    const id = await obtenerIdToken();
    const fet = await fetch(`${API_URL}/api/mensaje/listado?usuario=${id}`);

    const json = await fet.json();
    const data = json.data;

    setListadoUsuarios(data);
  };

  useEffect(() => {
    setMyID(obtenerIdToken());

    obtenerListado();
  }, []);

  useEffect(() => {
    if (userID) {
      abrirChat(userID);
    }
  }, [userID]);

  const abrirChat = async (idUsuario) => {
    const receptor = await obtenerUsuarioById(idUsuario);
    setReceptor(receptor);
    const fetchX = await fetch(`${API_URL}/api/mensaje/conversaciones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usuario1: myID,
        usuario2: idUsuario,
      }),
    });

    const json = await fetchX.json();
    const data = json.data;

    setMensajes(data);
    setView(true);
  };

  const enviaMensaje = async () => {
    if (!contenido.trim()) {
      return;
    }
    const fetchM = await fetch(`${API_URL}/api/mensaje/enviar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_remitente: myID,
        id_receptor: receptor?.id_usuario,
        contenido: contenido,
      }),
    });

    const mensaje = await fetchM.json();

    setContenido("");
    if (socket) socket.emit("enviar_mensaje", mensaje.data);
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!contenido) return;

    if (e.key === "Enter") {
      enviaMensaje();
    }
  };

  const buscarUsuarios = async (texto: string) => {
    const fetchUsuarios = await fetch(
      `${API_URL}/api/usuarios/buscar?search=${texto}`
    );
    const json = await fetchUsuarios.json();
    const data = json.data;
    setBusquedaUsuarios(data);
  };

  useEffect(() => {
    if (!socket) return;

    if (myID && receptor) {
      const sala = [myID, receptor.id_usuario].sort().join("-");
      socket.emit("join_room", sala);
    }

    const handleRecibirMensaje = (mensaje) => {
      setMensajes((prev) => [...prev, mensaje]);
      obtenerListado();
    };
    socket.on("recibir_mensaje", handleRecibirMensaje);

    return () => socket.off("recibir_mensaje", handleRecibirMensaje);
  }, [myID, receptor, socket]);

  return (
    <div className="grid grid-cols-12">
      <Nav_left />

      <main className="lg:col-span-10 col-span-12">
        <div className="grid grid-cols-12">
          {/* Listado de conversaciones */}
          <section className="col-span-3 border-r border-gray-500 h-screen pt-10 sticky top-0 ">
            <div className="border-b border-b-white flex items-center  justify-around pb-5 ">
              <p className="text-2xl font-bold sm:text-xl">Mensajes</p>
              <TbPencilPlus
                size={32}
                onClick={toggleModal}
                className="cursor-pointer"
              />

              {modalAbierto && (
                <div className="fixed inset-0 bg-black opacity-90 flex items-center justify-center">
                  <div className="bg-purple-500 p-8 rounded-lg shadow-2xl w-full max-w-xl relative">
                    <div className="flex items-center">
                      <button className="" onClick={toggleModal}>
                        <IoClose size={24} />
                      </button>
                      <h1 className="mx-auto text-xl">Escribir un mensaje</h1>
                    </div>
                    <input
                      type="text"
                      placeholder="Buscar usuario ..."
                      className="border w-full p-3 rounded mb-4 mt-8"
                      onChange={(e) => {
                        buscarUsuarios(e.target.value);
                      }}
                    />

                    {Array.isArray(busquedaUsuario) && (
                      <div className="max-h-80 overflow-auto scroll-hide">
                        {busquedaUsuario
                          .filter((u: any) => u.id_usuario !== myID)
                          .map((u: any) => (
                            <div
                              key={u.id_usuario}
                              onClick={() => {
                                abrirChat(u.id_usuario);
                                toggleModal();
                              }}
                              className="border flex space-x-5 p-6"
                            >
                              <img
                                src={u.avatar || avatarDefault}
                                className="w-12 h-12 rounded-full object-cover"
                                alt=""
                              />
                              <div className="flex flex-col">
                                <p>{u.nombre_completo || u.username}</p>
                                <p>@{u.username}</p>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div>
              {listaUsuarios?.map((chat: any, i) => {
                return (
                  <div
                    key={i}
                    onClick={() => abrirChat(chat.id_usuario)}
                    className="border my-3 p-4 cursor-pointer"
                  >
                    <div className="flex items-center space-x-5">
                      <img
                        src={chat.avatar || avatarDefault}
                        alt=""
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="md:flex  flex-col hidden  ">
                        <p className="font-bold text-xl">
                          {chat.nombre_completo || chat.username}
                        </p>
                        <p className="text-lg text-gray-300">
                          @{chat.username}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
          {/* Chat */}
          <section
            className={`col-span-9  text-center sticky top-0 h-screen ${
              modalAbierto ? "-z-50" : "z-0"
            }`}
          >
            {!view && (
              <div className="pt-48">
                <h1 className="font-bold text-3xl">
                  No tienes ningún mensaje seleccionado .
                </h1>
                <h2 className="text-xl pt-8">
                  Elige uno de tus mensajes existentes o crea uno nuevo.
                </h2>
                <button
                  onClick={toggleModal}
                  className="bg-purple-500 p-3 rounded-full mt-8 cursor-pointer  hover:bg-purple-700 "
                >
                  Nuevo Mensaje
                </button>
              </div>
            )}
            {/* Tiene mensajes */}
            {view && (
              <div className="relative h-screen">
                {/* Header */}
                <div className="border-b flex pt-8 pb-4 px-8 items-center space-x-8">
                  <FiArrowLeft
                    className="w-7 h-7 cursor-pointer"
                    size={24}
                    onClick={() => setView((prev) => !prev)}
                  />
                  <div>
                    <Link
                      to={`/perfil/${receptor?.username}`}
                      className="cursor-pointer flex flex-col items-start"
                    >
                      <p className="font-bold text-xl">
                        {receptor?.nombre_completo || receptor?.username}
                      </p>
                      <p className="text-lg">@{receptor?.username}</p>
                    </Link>
                  </div>
                </div>
                {/* chats */}
                <div className="lg:h-5/7 md:h-4/7 h-4/7">
                  <div className="h-full overflow-auto pl-18 scroll-hide">
                    {mensajes.map((c: any, i: number) => (
                      <div
                        key={i}
                        className={`flex px-8 pt-12 ${
                          c.id_remitente === myID
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div className="flex items-end gap-6">
                          {c.id_remitente != myID && (
                            <img
                              src={c.remitente.avatar || avatarDefault}
                              alt=""
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          )}
                          <div
                            className={` min-w-20 w-fit min-h-20 max-w-96 flex items-center justify-center relative    ${
                              c.id_remitente === myID
                                ? "bg-purple-950 rounded-2xl rounded-br-none right-0 " //si es mio
                                : "bg-purple-600 rounded-2xl rounded-bl-none left-0" // no es mio
                            } `}
                          >
                            <p className="p-2">{c.contenido}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="relative md:pt-40 lg:pt-12 pt-2 lg:ml-0 ml-4">
                  <input
                    type="text"
                    value={contenido}
                    onChange={(e) => setContenido(e.target.value)}
                    className="border rounded-4xl lg:w-3xl md:w-xl h-16 p-8 text-xl"
                    placeholder="Enviar un mensaje"
                    onKeyDown={handleEnter}
                  />
                  <VscSend
                    onClick={enviaMensaje}
                    size={24}
                    className="absolute lg:right-60 md:right-[-40px] right-6 lg:top-18 md:top-46 top-8 text-gray-300 cursor-pointer"
                  />
                </div>
              </div>
            )}
          </section>
        </div>
        <Menu_mobile />
      </main>
    </div>
  );
}

export default Mensajes;
