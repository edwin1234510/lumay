/**
 * Controlador del encabezado (Header).
 *
 * - Inicializa el nombre visible del usuario en el header leyendo `localStorage("usuario")`.
 * - Configura el comportamiento del menú hamburguesa para mostrar/ocultar la barra lateral (`.sidebar`)
 *   alternando la clase `ocultar`.
 * - Deja el sidebar oculto por defecto al cargar.
 *
 * @async
 * @returns {Promise<void>} No retorna valor; realiza efectos colaterales en el DOM (manipulación de nodos/clases).
 */
export const headerController = async () => {
  // Nodo donde se imprimirá el nombre del usuario (por ejemplo, en el header)
  const nombreElemento = document.querySelector("#nombre-usuario");

  // Referencias a la barra lateral y al checkbox del menú hamburguesa
  const sidebar = document.querySelector(".sidebar");
  const checkbox = document.querySelector("#menu_hamburguesa");

  // Estado inicial del menú: se marca como no seleccionado
  checkbox.checked = false;

  // Si está desmarcado al cargar, se oculta el sidebar aplicando la clase "ocultar"
  if (checkbox.checked == false) {
    sidebar.classList.add("ocultar");
  }

  // Escucha los clics/cambios del checkbox (menú hamburguesa)
  checkbox.addEventListener("click", () => {
    // Cuando está marcado → mostrar el sidebar
    if (checkbox.checked) {
      sidebar.classList.remove("ocultar");
    }
    // Cuando está desmarcado → ocultar el sidebar
    else {
      sidebar.classList.add("ocultar");
    }
  });

  // Recupera el objeto "usuario" almacenado en localStorage.
  // `localStorage.getItem` devuelve un string (o null). `JSON.parse` lo convierte a objeto.
  // Nota: `JSON.parse` es síncrono; el `await` aquí no es necesario, pero no afecta la ejecución.
  const usuario = await JSON.parse(localStorage.getItem("usuario"));

  // Si existe el objeto y tiene propiedad `nombre`, se muestra "nombre apellido".
  // En caso contrario, se usa el texto por defecto "Usuario".
  if (usuario && usuario.nombre) {
    nombreElemento.textContent = `${usuario.nombre}  ${usuario.apellido}`;
  } else {
    nombreElemento.textContent = "Usuario";
  }
};
