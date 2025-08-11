import { alertaError, alertaExito } from "../../componentes/sweetAlert";
import { post } from "../../utils/api";
import { esContrasenaSegura, esCorreoValido, esTelefonoValido, soloLetras, soloNumeros } from "../../validaciones/validacion";


export const registroController =  async() =>{
    const formularioRegistro = document.querySelector("#formRegistro");

    const documento = document.querySelector("#documento");
    const nombre = document.querySelector("#nombre");
    const apellido = document.querySelector("#apellido");
    const correo = document.querySelector("#correo");
    const contrasena = document.querySelector("#contrasena");
    const telefono = document.querySelector("#telefono");

    documento.addEventListener("keydown", soloNumeros);
    nombre.addEventListener("keydown", soloLetras);
    apellido.addEventListener("keydown", soloLetras);
    telefono.addEventListener("keydown", soloNumeros);

    formularioRegistro.addEventListener("submit", async(e)=>{
        e.preventDefault();
        if (
            documento.value.trim() === "" ||
            nombre.value.trim() === "" ||
            apellido.value.trim() === "" ||
            correo.value.trim() === "" ||
            contrasena.value.trim() === "" ||
            telefono.value.trim() === ""
          ) {
            return alertaError("Ningún campo puede estar vacío");
          }

        

        if (
            !esCorreoValido(correo.value) ||
            !esContrasenaSegura(contrasena.value) ||
            !esTelefonoValido(telefono.value)
          ) {
            return;
          }

        const objeto = {
            numero_documento: parseInt(documento.value.trim()),
            nombre: nombre.value.trim(),
            apellido: apellido.value.trim(),
            correo: correo.value.trim(),
            contrasena: contrasena.value.trim(),
            telefono: parseInt(telefono.value.trim()),
            id_rol: 1,
            id_estado_usuario: 1
        }
        try {
            const response = await post("usuarios", objeto);
            if (response.ok) {
            alertaExito("¡Te has registrado correctamente!");
            window.location.hash = "#login";
            } else {
            const errorText = await response.text();
            console.error("Respuesta del servidor:", errorText);
            alertaError("No fue posible el registro: " + errorText);
            }
        } catch (error) {
            alertaError("Error de conexión con el servidor");
            console.error(error);
        }
    })
}