const API_URL = import.meta.env.VITE_API_URL;

async function obtenerUsuarioById(idUsuario: number | string | undefined) {
  const url = `${API_URL}/api/usuarios/id/${idUsuario}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error al obtener usuario: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

async function obtenerUsuarioByUsername(username: string | undefined) {
  const url = `${API_URL}/api/usuarios/username/${username}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error al obtener usuario: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

function obtenerIdToken() {
  const token = localStorage.getItem("token");
  if (token) {
    const payload = parseJwt(token);
    const idUsuario = payload.id_usuario;
    return idUsuario;
  }
}

function parseJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.log(e);
    return null;
  }
}
// Clases del contenedor de multimedia según la cantidad

function getStyleMultimedia(length: number) {
  switch (length) {
    case 1:
      return "grid grid-cols-1 gap-4";
    case 2:
      return "grid grid-cols-2 gap-4";
    case 3:
      return "grid grid-cols-2 gap-4 auto-rows-[200px]";
    case 4:
      return "grid grid-cols-2 gap-4";
    default:
      return "";
  }
}

const calcularTiempo = (fecha: string | undefined) => {
  if (!fecha) {
    return;
  }
  const fechaPublicacion = new Date(fecha);
  const now = new Date();
  const diff = now.getTime() - fechaPublicacion.getTime();
  const segundos = Math.floor(diff / 1000);
  const minutos = Math.floor(segundos / 60);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);

  if (dias > 0) return `${dias} d`;
  if (horas > 0) return `${horas} h`;
  if (minutos > 0) return `${minutos} min`;
  return `${segundos}s`;
};

const toggleFollow = async (
  idSeguidor: string,
  idSeguido: string,
  socket: any
) => {
  try {
    const state = await fetch(
      `${API_URL}/api/follow?seguido=${idSeguido}&seguidor=${idSeguidor}`,
      {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({
          id_seguidor: idSeguidor,
          id_seguido: idSeguido,
        }),
      }
    );

    const json = await state.json();

    const data = {
      id_seguidor: idSeguidor,
      id_seguido: idSeguido,
      leSigo: json.leSigo,
    };

    socket?.emit("toggle_follow", data);
  } catch (error) {
    console.error("ERROR:", error);
  }
};

const tieneFollow = async (idSeguidor: string, idSeguido: string) => {
  if (!idSeguido || !idSeguidor) return;
  const fetchFollow = await fetch(
    `${API_URL}/api/follow/existe?seguido=${idSeguido}&seguidor=${idSeguidor}`
  );

  const data = await fetchFollow.json();
  return data;
};

export {
  obtenerUsuarioById,
  obtenerUsuarioByUsername,
  obtenerIdToken,
  parseJwt,
  getStyleMultimedia,
  calcularTiempo,
  toggleFollow,
  tieneFollow,
};
