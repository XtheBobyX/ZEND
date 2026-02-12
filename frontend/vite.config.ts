import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const API_URL = env.VITE_API_URL;

  return defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        "/socket.io": {
          target: `${API_URL}`,
          ws: true,
        },
      },
    },
  });
};
