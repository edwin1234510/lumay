export const headerController = async() => {
    const nombreElemento = document.querySelector("#nombre-usuario");
  
    const usuario = await JSON.parse(localStorage.getItem("usuario"));
  
    if (usuario && usuario.nombre) {
      nombreElemento.textContent = `${usuario.nombre}  ${usuario.apellido}`;
    } else {
      nombreElemento.textContent = "Usuario";
    }
  };