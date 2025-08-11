import { headerController } from "../../../componentes/headerController";
import { adminGaleriaController } from "./galeria/adminGaleriaController";
import { galeriaDetalleController } from "./galeria/detalles/galeriaDetalles";
import { crearCarta } from "./galeria/nueva/nuevaCarta";
import { adminMaterialController } from "./material/adminMaterial";
import { crearMaterialController } from "./material/formulario/crearMaterial";
import { editarMaterialController } from "./material/formulario/editarMaterial";
import { perfilController } from "./perfil/perfilController";
import { adminPiercingController } from "./piercing/adminPiercing";
import { editarPiercingController } from "./piercing/formularioPiercing/editarPiercingController";
import { piercingController } from "./piercing/formularioPiercing/piercingController";
import { adminCalendarioController } from "./reservas/adminReservasController";
import { editarReservasAdmin } from "./reservas/editarReservas";
import { usuarioEditarController } from "./usuarios/editar/usuarioEditarController";
import { usuarioController } from "./usuarios/usuarioController";
import { adminZonaController } from "./zona/adminZonaController";
import { crearZona } from "./zona/formularioZona/CrearZona";
import { editarZona } from "./zona/formularioZona/editarZona";

export const dashboardAdminController = async() =>{

    const header = document.querySelector("#header");
    const headerHtml = await fetch("./src/componentes/headerAdmin.html").then(r => r.text());
    header.innerHTML = headerHtml;
    await headerController();

    const sidebar = document.querySelector("#sidebar");
    const sidebarHtml = await fetch("./src/componentes/sidebarAdmin.html").then(r => r.text());
    sidebar.innerHTML = sidebarHtml;

    const main = document.querySelector("#contenido-dinamico");

    const renderContenido = async () => {

        const hash = location.hash.slice(1);
        const partes = hash.split("/");
        console.log(partes);

        if(partes[1] == "usuarios" && partes[2] == "editar"){
            const id = partes[3];
            const vistaHtml = await fetch("./src/views/dashboard/admin/usuarios/editar/index.html");
            const html = await vistaHtml.text();
            main.innerHTML = html;
            await usuarioEditarController(id)
        }
        else if (partes[1] == "perfil") {
            const vistaHtml = await fetch("./src/views/dashboard/cliente/perfil/index.html");
            const html = await vistaHtml.text();
            main.innerHTML = html;
            await perfilController();
          }
        else if(partes[1] == "zona" && partes[2] == "nuevo"){
            const vistaHtml = await fetch("./src/views/dashboard/admin/zona/formularioZona/index.html");
            const html = await vistaHtml.text();
            main.innerHTML = html;
            crearZona();
        }
        else if(partes[1] == "zona" && partes[2] == "editar"){
            const id = partes[3]
            const vistaHtml = await fetch("./src/views/dashboard/admin/zona/formularioZona/index.html");
            const html = await vistaHtml.text();
            main.innerHTML = html;
            editarZona(id);
        }
        else if(partes[1] == "zona"){
            const vistaHtml = await fetch("./src/views/dashboard/admin/zona/index.html");
            const html = await vistaHtml.text();
            main.innerHTML = html;
            adminZonaController();
        }
        else if(partes[1] == "material" && partes[2] == "nuevo"){
            const vistaHtml = await fetch("./src/views/dashboard/admin/material/formulario/index.html");
            const html = await vistaHtml.text();
            main.innerHTML = html;
            crearMaterialController();
        }
        else if(partes[1] == "material" && partes[2] == "editar"){
            const id = partes[3]
            const vistaHtml = await fetch("./src/views/dashboard/admin/material/formulario/index.html");
            const html = await vistaHtml.text();
            main.innerHTML = html;
            editarMaterialController(id);
        }
        else if(partes[1] == "material"){
            const vistaHtml = await fetch("./src/views/dashboard/admin/material/index.html");
            const html = await vistaHtml.text();
            main.innerHTML = html;
            adminMaterialController();
        }
        else if(partes[1] == "piercing" && partes[2] == "nuevo"){
            const vistaHtml = await fetch("./src/views/dashboard/admin/piercing/formularioPiercing/index.html");
            const html = await vistaHtml.text();
            main.innerHTML = html;
            piercingController();
        }
        else if(partes[1] == "piercing" && partes[2] == "editar"){
            const id = partes[3];
            const vistaHtml = await fetch("./src/views/dashboard/admin/piercing/formularioPiercing/index.html");
            const html = await vistaHtml.text();
            main.innerHTML = html;
            editarPiercingController(id)
        }
        else if(partes[1] == "piercing"){
            const id = partes[3];
            const vistaHtml = await fetch("./src/views/dashboard/admin/piercing/index.html");
            const html = await vistaHtml.text();
            main.innerHTML = html;
            adminPiercingController();
        }
        else if(partes[2] == "detalles"){
            const id = partes[3];
            const vistaHtml = await fetch("./src/views/dashboard/admin/galeria/detalles/index.html");
            const html = await vistaHtml.text();
            main.innerHTML = html;
            await galeriaDetalleController(id);
        }
        else if(partes[2] == "nueva" ){
            const vistaHtml = await fetch("./src/views/dashboard/admin/galeria/nueva/index.html");
            const html = await vistaHtml.text();
            main.innerHTML = html;
            await crearCarta();
        }
        else if(partes[0] == "admin" && partes[1] == "galeria"){
            const vistaHtml = await fetch("./src/views/dashboard/admin/galeria/index.html");
            const html = await vistaHtml.text();
            main.innerHTML = html;
            await adminGaleriaController();
        }
        else if(partes[1] == "editar-cita"){
            const id = partes[2];
            const vistaHtml = await fetch("./src/views/dashboard/cliente/reserva/editar/index.html");
            const html = await vistaHtml.text();
            main.innerHTML = html
            await editarReservasAdmin(id);
        }
        else if(partes[0] == "admin" && partes[1] == "reservas"){
            const vistaHtml = await fetch("./src/views/dashboard/admin/reservas/index.html");
            const html = await vistaHtml.text();
            main.innerHTML = html
            await adminCalendarioController();
        }
        else if (partes.length == 1 || partes[1] == "usuarios") {
            const vistaHtml = await fetch("./src/views/dashboard/admin/usuarios/index.html");
            const html = await vistaHtml.text();
            main.innerHTML = html;
            await usuarioController();
        }
    };
    await renderContenido();

}