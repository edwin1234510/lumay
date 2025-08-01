import { alertaError } from "../componentes/sweetAlert";
import { get } from "../utils/api";

export const soloLetras=(event)=>{
    let tecla=event.key;
    const letras=/[a-zñáéíóú\s]/i;
    if(!letras.test(tecla)&& tecla!="Backspace"){
        event.preventDefault();
    }
}

export const soloNumeros=(event)=>{
    let tecla=event.key;
    const numeros=/[0-9]/;
    if(!numeros.test(tecla) && tecla!="Backspace"){
    event.preventDefault();
  }
}


export const esCorreoValido = (correo) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(correo)) {
        alertaError("El correo no es valido");
        return  false
    }
    return true
};
  
export const esContrasenaSegura = (contrasena) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if(!regex.test(contrasena)){
        alertaError("Requiere al menos 8 caracteres, 1 mayúscula, 1 minúscula, 1 número, 1 símbolo");
        return  false
    }
    return true
};
  
export const esTelefonoValido = (telefono) => {
    const regex = /^\d{10}$/;
    if (!regex.test(telefono)) {
        alertaError("El telefono debe ser de 10 digitos");
        return  false
    }
    return true
};

export const nombreRol = async(rol_id) =>{
    const data = await get("roles");
    let rol = data.find(rol => rol_id == rol.id);
    return rol.nombre;
}

export const nombreUsuario = async(id) =>{
  const data = await get("usuarios");
  let usuario = data.find(usuario => id == usuario.id_usuario);
  return usuario.nombre;
}



export async function traerPerfo(id_piercing) {
    const piercings = await get("piercings");
  
    return piercings.find((piercing) => {
      if (id_piercing == piercing.id_piercing) {
        return piercing;
      }
    });
  
  }

  export async function traerMate(id_material) {
    const materiales = await get("materiales");
  
    return materiales.find((material) => {
      if (id_material == material.id_material) {
        return material;
      }
    });
  
  }

  export async function traerCitas(id_cita) {
    const citas = await get("citas");
  
    return citas.find((cita) => {
      if (id_cita == cita.id_cita) {
        return cita;
      }
    });
  
  }