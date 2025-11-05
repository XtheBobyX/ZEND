import { BrowserRouter, Route, Routes } from "react-router";
import Welcome from "./pages/welcome";
import "./index.css";
import Login from "./pages/login";
import Register from "./pages/register";
import Crear_Perfil from "./pages/crear-perfil";
import Home from "./pages/home";
import Profile from "./pages/profile";
import Comentarios from "./pages/comentarios";
import Marcadores from "./pages/marcadores";
import Follows from "./pages/follows";
import Busqueda from "./pages/busqueda";
import Mensajes from "./pages/mensajes";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* AUTH */}
          <Route
            path="/welcome"
            element={
              <PublicRoute>
                <Welcome />
              </PublicRoute>
            }
          ></Route>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          ></Route>
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          ></Route>
          {/* <Route path="/logout" element={<Home />}></Route> */}

          {/*  */}
          <Route path="/crear-perfil" element={<Crear_Perfil />}></Route>
          {/* Nav Main */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/explorar"
            element={
              <ProtectedRoute>
                <Busqueda />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/mensajes"
            element={
              <ProtectedRoute>
                <Mensajes />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/marcadores"
            element={
              <ProtectedRoute>
                <Marcadores />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/perfil/:id"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          ></Route>
          {/*  Extras */}
          <Route
            path="/:username/post/:id"
            element={
              <ProtectedRoute>
                <Comentarios />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/seguidos/:id"
            element={
              <ProtectedRoute>
                <Follows />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/seguidores/:id"
            element={
              <ProtectedRoute>
                <Follows />
              </ProtectedRoute>
            }
          ></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
