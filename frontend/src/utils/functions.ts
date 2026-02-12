const API_URL = import.meta.env.VITE_API_URL;

async function fetchJSON(url: string) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}

async function getUserByID(user_id: number | string) {
  const url = `${API_URL}/api/users/id/${user_id}`;
  if (!user_id) return null;
  return fetchJSON(url);
}

async function getUserByUsername(username: string | undefined) {
  const url = `${API_URL}/api/users/username/${username}`;
  if (!username) return null;
  return fetchJSON(url);
}

function parseJwt(token: string) {
  try {
    const base64 = token.split(".")[1];
    return JSON.parse(atob(base64));
  } catch (e) {
    return null;
  }
}

function getTokenId() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const payload = parseJwt(token);

  return payload.user_id ?? null;
}

function getStyleMultimedia(length: number): string {
  const styles: Record<number, string> = {
    1: "grid grid-cols-1 gap-4",
    2: "grid grid-cols-2 gap-4",
    3: "grid grid-cols-2 gap-4 auto-rows-[200px]",
    4: "grid grid-cols-2 gap-4",
  };

  return styles[length] ?? "";
}

function calculateTime(fecha?: string): string {
  if (!fecha) return "";

  const diff = Date.now() - new Date(fecha).getTime();
  if (diff < 0) return "0s";

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days) return `${days} d`;
  if (hours) return `${hours} h`;
  if (minutes) return `${minutes} min`;
  return `${seconds}s`;
}

const toggleFollow = async (
  follower_id: string,
  followed_id: string,
  socket: any,
) => {
  if (!follower_id || !followed_id) return;

  try {
    const response = await fetch(`${API_URL}/api/follow`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ follower_id, followed_id }),
    });

    if (!response.ok) throw new Error("Toggle follow failed");

    const json = await response.json();

    const data = {
      follower_id,
      followed_id,
      isFollowing: json.isFollowing,
    };

    socket?.emit("toggle_follow", data);
  } catch (error) {
    console.error("ERROR:", error);
  }
};

const checkFollow = async (follower_id: string, followed_id: string) => {
  if (!followed_id || !follower_id || followed_id === follower_id) return;

  const url = `${API_URL}/api/follow/exist?followed=${followed_id}&follower=${follower_id}`;
  const res = await fetch(url);

  const data = await res.json();
  return data.data;
};

export {
  getUserByID,
  getUserByUsername,
  getTokenId,
  parseJwt,
  getStyleMultimedia,
  calculateTime,
  toggleFollow,
  checkFollow,
};
