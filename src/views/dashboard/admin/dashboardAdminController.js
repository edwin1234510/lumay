import { headerController } from "../../../componentes/headerController";
import { adminGaleriaController } from "./galeria/adminGaleriaController";
import { crearCarta } from "./galeria/nueva/nuevaCarta";
import { adminCalendarioController } from "./reservas/adminReservasController";
import { editarReservasAdmin } from "./reservas/editarReservas";
import { usuarioEditarController } from "./usuarios/editar/usuarioEditarController";
import { usuarioController } from "./usuarios/usuarioController";

export const dashboardAdminController = async() =>{

    const header = document.querySelector("#header");
    const headerHtml = await fetch("./src/componentes/header.html").then(r => r.text());
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
        else if (partes[1] == "usuarios") {
            const vistaHtml = await fetch("./src/views/dashboard/admin/usuarios/index.html");
            const html = await vistaHtml.text();
            main.innerHTML = html;
            await usuarioController();
        }
    };
    await renderContenido();

}