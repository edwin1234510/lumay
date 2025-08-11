import { get, put } from "../../../../../utils/api";
import { alertaError, alertaExito } from "../../../../../componentes/sweetAlert";

export const editarPiercingController = async (id) => {
  const form = document.querySelector("#formPerfo");
  const inputNombre = document.querySelector("#piercing");
  const inputPrecio = document.querySelector("#precio");
  const selectZona = document.querySelector("#zona");

  // 📌 Crear el combo de estados dinámicamente
  const labelEstado = document.createElement("label");
  labelEstado.classList.add("formulario__label");
  labelEstado.setAttribute("for", "estado");
  labelEstado.textContent = "Estado del piercing";

  const selectEstado = document.createElement("select");
  selectEstado.classList.add("formulario__input");
  selectEstado.id = "estado";

  // Insertar el label y el select antes del botón
  const btnSiguiente = document.querySelector("#btnSiguiente");
  form.insertBefore(labelEstado, btnSiguiente);
  form.insertBefore(selectEstado, btnSiguiente);

  if (!id) return; // Si no hay id, no estamos editando

  // 📌 Cargar zonas (solo activas)
  const zonas = await get("zonas");
  zonas
    .filter(z => z.id_estado_zona === 1)
    .forEach(z => {
      const option = document.createElement("option");
      option.value = z.id_zona;
      option.textContent = z.nombre_zona;
      selectZona.appendChild(option);
    });

  // 📌 Cargar estados del piercing
  const estados = await get("estados_piercings");
  estados.forEach(e => {
    const option = document.createElement("option");
    option.value = e.id_estado_piercing;
    option.textContent = e.nombre_estado;
    selectEstado.appendChild(option);
  });

  // 📌 Obtener piercing por ID
  const piercings = await get("piercings");
  const piercing = piercings.find(p => p.id_piercing == id);

  if (!piercing) {
    alertaError("No se encontró el piercing");
    return;
  }

  // 📌 Llenar formulario
  inputNombre.value = piercing.nombre_piercing;
  inputPrecio.value = piercing.precio_piercing;
  selectZona.value = piercing.id_zona;
  selectEstado.value = piercing.id_estado_piercing;

  // 📌 Manejar envío del formulario para actualizar
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = inputNombre.value.trim();
    const precio = parseFloat(inputPrecio.value.trim());
    const idZona = parseInt(selectZona.value);
    const idEstado = parseInt(selectEstado.value);

    if (!nombre || isNaN(precio) || isNaN(idZona) || isNaN(idEstado)) {
      alertaError("Por favor completa todos los campos correctamente.");
      return;
    }

    const nuevoPiercing = {
      nombre_piercing: nombre,
      precio_piercing: precio,
      id_zona: idZona,
      id_estado_piercing: idEstado
    };

    try {
      await put(`piercings/${id}`, nuevoPiercing);
      alertaExito("Piercing actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar:", error);
      alertaError("Error al actualizar el piercing");
    }
  });
};
