import { alertaError } from "../componentes/sweetAlert";
import { get } from "../utils/api";

/**
 * Restringe la entrada del usuario para que solo permita letras (mayúsculas, minúsculas, espacios y acentos).
 * 
 * @param {KeyboardEvent} event - Evento del teclado.
 */
export const soloLetras = (event) => {
    let tecla = event.key; // Capturamos la tecla presionada por el usuario
    const letras = /[a-zñáéíóú\s]/i; // Expresión regular que permite letras y espacios (mayúsculas/minúsculas)
    
    // Si la tecla no cumple con la expresión regular y no es la tecla "Backspace"
    if (!letras.test(tecla) && tecla != "Backspace") {
        event.preventDefault(); // Bloqueamos la entrada del carácter
    }
};

/**
 * Restringe la entrada del usuario para que solo acepte números.
 * 
 * @param {KeyboardEvent} event - Evento del teclado.
 */
export const soloNumeros = (event) => {
    let tecla = event.key; // Capturamos la tecla presionada
    const numeros = /[0-9]/; // Solo se permiten números
    
    // Si no es un número y tampoco es "Backspace"
    if (!numeros.test(tecla) && tecla != "Backspace") {
        event.preventDefault(); // Se bloquea la entrada
    }
};

/**
 * Valida que un correo electrónico tenga un formato correcto.
 * 
 * @param {string} correo - Correo electrónico a validar.
 * @returns {boolean} `true` si es válido, `false` en caso contrario.
 */
export const esCorreoValido = (correo) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular para formato de correos
    
    // Si el correo no cumple con el formato
    if (!regex.test(correo)) {
        alertaError("El correo no es válido"); // Mostramos alerta de error
        return false; // Retornamos false
    }
    return true; // Si es válido, retornamos true
};

/**
 * Verifica si una contraseña es segura.
 * Debe contener:
 * - Al menos 8 caracteres
 * - Una mayúscula
 * - Una minúscula
 * - Un número
 * - Un símbolo
 * 
 * @param {string} contrasena - Contraseña a validar.
 * @returns {boolean} `true` si cumple los requisitos, `false` si no.
 */
export const esContrasenaSegura = (contrasena) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/; // Reglas de seguridad
    
    // Validamos la contraseña con la expresión regular
    if (!regex.test(contrasena)) {
        alertaError("Requiere al menos 8 caracteres, 1 mayúscula, 1 minúscula, 1 número, 1 símbolo");
        return false;
    }
    return true;
};

/**
 * Verifica si un teléfono tiene exactamente 10 dígitos.
 * 
 * @param {string} telefono - Número telefónico a validar.
 * @returns {boolean} `true` si es válido, `false` si no.
 */
export const esTelefonoValido = (telefono) => {
    const regex = /^\d{10}$/; // Solo se permiten exactamente 10 números
    
    // Si no cumple la condición
    if (!regex.test(telefono)) {
        alertaError("El teléfono debe ser de 10 dígitos");
        return false;
    }
    return true;
};

/**
 * Obtiene el nombre de un rol según su ID.
 * 
 * @param {number} rol_id - ID del rol.
 * @returns {Promise<string>} Nombre del rol.
 */
export const nombreRol = async (rol_id) => {
    const data = await get("roles"); // Obtenemos la lista de roles desde la API
    let rol = data.find(rol => rol_id == rol.id); // Buscamos el rol que coincida con el ID
    return rol.nombre; // Retornamos el nombre del rol
};

/**
 * Obtiene el nombre de un usuario según su ID.
 * 
 * @param {number} id - ID del usuario.
 * @returns {Promise<string>} Nombre del usuario.
 */
export const nombreUsuario = async (id) => {
    const data = await get("usuarios"); // Llamada a la API para traer los usuarios
    let usuario = data.find(usuario => id == usuario.id_usuario); // Buscamos el usuario
    return usuario.nombre; // Retornamos su nombre
};

/**
 * Obtiene el nombre de una zona según su ID.
 * 
 * @param {number} id_zona - ID de la zona.
 * @returns {Promise<string>} Nombre de la zona.
 */
export async function nombreZona(id_zona) {
    const data = await get("zonas"); // Traemos todas las zonas
    let zona = data.find(zona => id_zona == zona.id_zona); // Buscamos la zona por ID
    return zona.nombre_zona; // Retornamos el nombre de la zona
}

/**
 * Obtiene la información de un piercing según su ID.
 * 
 * @param {number} id_piercing - ID del piercing.
 * @returns {Promise<Object>} Objeto con los datos del piercing.
 */
export async function traerPerfo(id_piercing) {
    const piercings = await get("piercings"); // Llamamos a la API para traer todos los piercings
    
    // Buscamos el piercing que coincida con el ID
    return piercings.find(piercing => id_piercing == piercing.id_piercing);
}

/**
 * Obtiene la información de un material según su ID.
 * 
 * @param {number} id_material - ID del material.
 * @returns {Promise<Object>} Objeto con los datos del material.
 */
export async function traerMate(id_material) {
    const materiales = await get("materiales"); // Llamamos a la API para traer todos los materiales
    return materiales.find(material => id_material == material.id_material); // Buscamos el material
}

/**
 * Obtiene la información de una cita según su ID.
 * 
 * @param {number} id_cita - ID de la cita.
 * @returns {Promise<Object>} Objeto con los datos de la cita.
 */
export async function traerCitas(id_cita) {
    const citas = await get("citas"); // Llamamos a la API para traer todas las citas
    return citas.find(cita => id_cita == cita.id_cita); // Buscamos la cita correspondiente
}

/**
 * Obtiene el nombre de un estado de zona según su ID.
 * 
 * @param {number} id_estado_zona - ID del estado de la zona.
 * @returns {Promise<string>} Nombre del estado.
 */
export async function obtenerNombreEstadoZona(id_estado_zona) {
    const estados = await get("estados_zonas"); // Llamamos a la API de estados de zonas
    const estadoEncontrado = estados.find(estado => estado.id_estado_zona === id_estado_zona); // Buscamos el estado
    return estadoEncontrado.nombre_estado; // Retornamos el nombre
}

/**
 * Obtiene el nombre de un estado de material según su ID.
 * 
 * @param {number} id_estado_material - ID del estado del material.
 * @returns {Promise<string>} Nombre del estado.
 */
export async function obtenerNombreEstadoMaterial(id_estado_material) {
    const estados = await get("estados_materiales_joyas"); // Llamada a la API
    const estadoEncontrado = estados.find(estado => estado.id_estado_material === id_estado_material);
    return estadoEncontrado.nombre_estado;
}

/**
 * Obtiene el nombre de un estado de piercing según su ID.
 * 
 * @param {number} id_estado_piercing - ID del estado del piercing.
 * @returns {Promise<string>} Nombre del estado.
 */
 

/**
 * Obtiene el nombre de un estado de cita según su ID.
 * 
 * @param {number} id_estado_cita - ID del estado de la cita.
 * @returns {Promise<string>} Nombre del estado.
 */
export async function obtenerNombreEstadoCita(id_estado_cita) {
    const estados = await get("estados_citas"); 
    const estadoEncontrado = estados.find(estado => estado.id_estado_cita === id_estado_cita);
    return estadoEncontrado.nombre_estado;
}
