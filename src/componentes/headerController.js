export const headerController = async () => {
  const nombreElemento = document.querySelector("#nombre-usuario");

  const sidebar = document.querySelector(".sidebar");
  const checkbox = document.querySelector("#menu_hamburguesa");
  checkbox.checked = false;

  if (checkbox.checked == false) {
    sidebar.classList.add("ocultar");
  }
  checkbox.addEventListener("click", () => {
    if (checkbox.checked) {
      sidebar.classList.remove("ocultar")
    }
    else {
      sidebar.classList.add("ocultar");
    }

  })


  const usuario = await JSON.parse(localStorage.getItem("usuario"));

  if (usuario && usuario.nombre) {
    nombreElemento.textContent = `${usuario.nombre}  ${usuario.apellido}`;
  } else {
    nombreElemento.textContent = "Usuario";
  }
};
