import Swal from 'sweetalert2';

/**
 * Muestra una alerta visual de éxito usando SweetAlert2.
 * 
 * - Construye y dispara un modal con icono de éxito y el texto recibido.
 * 
 * @param {string} texto - Mensaje que se mostrará en la alerta.
 * @returns {void} No retorna ningún valor. (Internamente se llama a `Swal.fire`, que sí devuelve una Promise, pero aquí esa Promise **no** se retorna.)
 */
export function alertaExito(texto) {
  // Llamada a SweetAlert2 para mostrar la alerta con icono 'success'.
  // Nota: `Swal.fire` devuelve una Promise, pero no la retornamos desde esta función.
  Swal.fire({
    icon: 'success',
    title: 'Éxito',
    text: texto
  });
}

/**
 * Muestra una alerta visual de error usando SweetAlert2.
 * 
 * - Construye y dispara un modal con icono de error y el texto recibido.
 * 
 * @param {string} texto - Mensaje que se mostrará en la alerta de error.
 * @returns {void} No retorna ningún valor. (La Promise interna de `Swal.fire` se ignora.)
 */
export function alertaError(texto) {
  // Dispara un modal indicando un error.
  Swal.fire({
    icon: 'error',
    title: 'Error',
    text: texto
  });
}

/**
 * Muestra una alerta informativa con botón de confirmación personalizado.
 * 
 * - Ideal para mensajes que solo requieren confirmación de lectura por parte del usuario.
 * 
 * @param {string} titulo - Título de la alerta.
 * @param {string} mensaje - Texto descriptivo de la alerta.
 * @returns {void} No retorna ningún valor. (Se invoca `Swal.fire` y se ignora su Promise.)
 */
export function alertaInfo(titulo, mensaje) {
  // Se configura un modal tipo "info" con botón personalizado para cerrar.
  Swal.fire({
    icon: "info",
    title: titulo,
    html: mensaje,
    confirmButtonText: "¡Entendido!",
    confirmButtonColor: "#3085d6",
  });
}

/**
 * Muestra una confirmación modal (Aceptar / Cancelar) y ejecuta una acción si el usuario confirma.
 * 
 * - Se abre un modal de advertencia.
 * - Si el usuario confirma (Aceptar), se ejecuta la función `accionConfirmada`.
 * 
 * @param {string} titulo - Título de la confirmación.
 * @param {string} texto - Mensaje explicativo.
 * @param {Function} accionConfirmada - Callback que se ejecutará si el usuario confirma.
 * @returns {void} No retorna valor. (Se maneja la respuesta con `.then()` y no se retorna la Promise.)
 */
export function confirmarAccion(titulo, texto, accionConfirmada) {
  // Abrimos el modal con opciones de confirmación y cancelación.
  Swal.fire({
    title: titulo,
    text: texto,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Aceptar',
    cancelButtonText: 'Cancelar'
  })
    // `.then` se ejecuta cuando el usuario interactúa con el modal (confirma, cancela o cierra).
    .then((result) => {
      // `result.isConfirmed` es true si el usuario presionó "Aceptar".
      if (result.isConfirmed) {
        // Ejecutamos la acción pasada como parámetro solo cuando el usuario confirma.
        accionConfirmada();
      }
      // Si no confirmó, no hacemos nada (queda implícito cancelar la acción).
    });
}

/**
 * Muestra un modal con opciones para "Editar", "Eliminar" o "Cerrar".
 * 
 * - Espera la interacción del usuario (async/await).
 * - Si elige "Editar" (acción confirmada por `confirmButtonText`), se ejecuta `onEditar`.
 * - Si elige "Eliminar" (deny), se solicita una segunda confirmación mediante `confirmarAccion`
 *   y, de confirmarse, se ejecuta `onEliminar`.
 * 
 * @param {string} titulo - Título del modal principal.
 * @param {string} texto - Contenido HTML/texto que se mostrará en el modal.
 * @param {Function} onEditar - Callback que se ejecuta si el usuario selecciona "Editar".
 * @param {Function} onEliminar - Callback que se ejecuta si el usuario confirma la eliminación.
 * @returns {Promise<void>} Retorna una Promise que se resuelve cuando termina el flujo (no retorna datos útiles).
 */
export const alertaEditarEliminar = async (titulo, texto, onEditar, onEliminar) => {
  // Mostramos un modal con botones: Confirm (Editar), Deny (Eliminar), Cancel (Cerrar).
  // `await Swal.fire(...)` espera a que el usuario elija una opción.
  const { value: accion } = await Swal.fire({
    title: titulo,
    html: texto,
    icon: "question",
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: "Editar",
    denyButtonText: "Eliminar",
    cancelButtonText: "Cerrar",
    reverseButtons: true,
    customClass: {
      confirmButton: 'swal2-confirm',
      denyButton: 'swal2-deny',
      cancelButton: 'swal2-cancel'
    }
  });

  // Nota: la estructura del resultado de SweetAlert2 normalmente incluye propiedades como
  // `isConfirmed` y `isDenied`. En este código se está extrayendo `value` como `accion`.
  // A partir de ese valor, se comparan === true / === false.
  // (Se mantiene la lógica original sin modificarla.)

  if (accion === true) {
    // 👉 Caso: el usuario eligió la acción equivalente a "Editar".
    // Si `onEditar` es una función válida, la ejecutamos.
    if (typeof onEditar === "function") onEditar();
  } else if (accion === false) {
    // 👉 Caso: el usuario eligió la acción equivalente a "Eliminar".
    // Antes de eliminar, solicitamos una confirmación adicional.
    const confirmacion = await confirmarAccion(
      "¿Eliminar cita?",
      "Esta acción no se puede deshacer. ¿Deseas continuar?",
      async () => {
        // Si el usuario confirma la segunda ventana, ejecutamos el callback onEliminar (si existe).
        if (typeof onEliminar === "function") onEliminar();
      }
    );

    // `confirmacion` no contendrá un valor útil porque `confirmarAccion` no retorna,
    // pero el flujo de ejecución se maneja mediante el callback pasado a `confirmarAccion`.
  }
};
