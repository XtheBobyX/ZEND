import "../index.css";
import { Link } from "react-router";
// Imagenes
import homeImg from "../assets/img/home-welcome.png";
import perfilImg from "../assets/img/profile-welcome.png";
import zendLogo from "../assets/img/zend-logo.svg";
//

function Welcome() {
  return (
    <div className="w-[90%] flex mx-auto mt-7">
      <div className="w-2/5 bg-purple-700 shadow-2xl shadow-purple-500 pt-6 hidden lg:flex">
        <div className="ml-16">
          <img
            src={homeImg}
            alt="Ejemplo de una pantalla del home dispositivos movil"
            className="absolute h-[600px]"
          />
          <img
            src={perfilImg}
            alt="Ejemplo de una pantalla del perfil dispositivos movil"
            className="relative h-[660px] left-24 bottom-6"
          />
        </div>
      </div>
      <div className="w-full lg:w-3/5 bg-[#1B1B1B] border-4 border-purple-700 px-4 shadow-2xl shadow-purple-500">
        <h1 className="text-4xl lg:text-6xl text-center pt-8 font-zen">
          EXPLORA ZEND
        </h1>
        <img src={zendLogo} alt="Logo de la app" className=" mx-auto my-12" />
        <p className="text-xl md:text-2xl md:w-1/2 ml-10 md:ml-44 lg:ml-56">
          Red social para compartir ideas, conectar y estar al día. Exprésate
          libremente en una comunidad que valora el contenido de calidad.
        </p>

        <div className="text-center">
          <Link to="/register">
            <button className="border border-white py-3 rounded-3xl w-full md:w-1/2  my-8 text-xl hover:bg-white hover:text-black cursor-pointer">
              Únete a Zend
            </button>
          </Link>
          <div className="flex justify-center items-center gap-6">
            <div className="border border-white w-2/4 md:w-1/5 h-0"></div>
            <span>O</span>
            <div className="border border-white w-2/4 md:w-1/5 h-0"></div>
          </div>
          <p className="text-center pt-2">
            ¿Ya eres parte? {""}
            <Link to="/login">
              <span className="text-purple-500 hover:text-purple-600 cursor-pointer">
                Inicia sesión
              </span>
            </Link>
          </p>

          <Link to="/login">
            <button className="w-full md:w-1/2  py-3 rounded-3xl my-4 text-xl bg-purple-700 hover:bg-purple-600 cursor-pointer">
              Iniciar Sesión
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
