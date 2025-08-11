import { alertaError, alertaExito } from "../../componentes/sweetAlert.js";
import { post } from "../../utils/api.js";
import { nombreRol } from "../../validaciones/validacion.js";

export const loginController = () => {
  const formularioLogin = document.querySelector("#login");

  if (!formularioLogin) {
    console.error("Formulario de login no encontrado");
    return;
  }

  formularioLogin.addEventListener("submit", async (e) => {
    e.preventDefault();

    const correo = document.querySelector("#email").value.trim();
    const contrasena = document.querySelector("#contrasena").value.trim();

    if (!correo || !contrasena) {
      return alertaError("Ningún campo puede estar vacío");
    }

    const objeto = {
      correo,
      contrasena
    };

    try {
      const response = await post("usuarios/login", objeto);
    
      if (response.ok) {
        const data = await response.json();
        const rol = await nombreRol(data.id_rol);
        localStorage.setItem("usuario", JSON.stringify(data));
        alertaExito(`Bienvenido, ${data.nombre}`);
    
        if (rol === "admin") {
          window.location.hash = "admin";
        } else if (rol === "cliente") {
          window.location.hash = "cliente";
        }
    
      } else if (response.status === 403) {
        alertaError("El usuario está inactivo, no puede iniciar sesión.");
      } else if (response.status === 401) {
        alertaError("Credenciales incorrectas.");
      } else {
        alertaError("Error desconocido al iniciar sesión.");
      }
    
    } catch (error) {
      alertaError("Error de conexión con el servidor");
      console.error(error);
    }
    
  });
};
