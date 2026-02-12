import { BrowserRouter, Route, Routes } from "react-router";
import Welcome from "./pages/welcome";
import "./index.css";
import Update_Profile from "./pages/update_profile";
import Home from "./pages/home";
import Profile from "./pages/profile";
import Comentarios from "./pages/comments";
import Marcadores from "./pages/bookmarks";
import Follows from "./pages/follows";
import Busqueda from "./pages/search";
import Mensajes from "./pages/messages";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Register from "./pages/register";
import Login from "./pages/login";

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
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          {/* <Route path="/logout" element={<Home />}></Route> */}

          {/*  */}
          <Route path="/update-profile" element={<Update_Profile />} />
          {/* Nav Main */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/explore"
            element={
              <ProtectedRoute>
                <Busqueda />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <Mensajes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookmarks"
            element={
              <ProtectedRoute>
                <Marcadores />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          {/*  Extras */}
          <Route
            path="/:username/post/:id"
            element={
              <ProtectedRoute>
                <Comentarios />
              </ProtectedRoute>
            }
          />
          <Route
            path="/followed/:id"
            element={
              <ProtectedRoute>
                <Follows />
              </ProtectedRoute>
            }
          />
          <Route
            path="/follower/:id"
            element={
              <ProtectedRoute>
                <Follows />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
