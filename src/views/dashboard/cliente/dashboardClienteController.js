import { headerController } from "../../../componentes/headerController";
import { agendarCitaController } from "./agendar/agendarController";
import { seleccionPerforacionController } from "./agendar/piercing/piercingAgendarController";
import { detalleReservaController } from "./reserva/detalles/detalleReservaController";
import { editarDetalleController } from "./reserva/detalles/editar/editarDetalleController";
import { editarReservaController } from "./reserva/editar/editarReservaController";
import { reservaController } from "./reserva/reservaController";




export const dashboardClienteController = async () => {
  const header = document.querySelector("#header");

  const headerHtml = await fetch("./src/componentes/header.html").then(r => r.text());
  header.innerHTML = headerHtml;

  await headerController();

  const sidebar = document.querySelector("#sidebar");
  const sidebarHtml = await fetch("./src/componentes/sidebarCliente.html").then(r => r.text());
  sidebar.innerHTML = sidebarHtml;


  const main = document.querySelector("#contenido-dinamico");
  const renderContenido = async () => {
    const hash = location.hash.slice(1);
    const partes = hash.split("/");
    console.log(partes);
    if (partes[1] === "reserva" && partes[2] === "editar") {
      // Editar reserva (cliente/reserva/editar/:id)
      const idCita = partes[3];
      const vistaHtml = await fetch("./src/views/dashboard/cliente/reserva/editar/index.html");
      const html = await vistaHtml.text();
      main.innerHTML = html;
      await editarReservaController(idCita);
    }
    else if (partes.length == 1 || partes[1] == "reserva") {
      await reservaController(main);
    }
    else if (partes[1] == "agendar" && partes[2] == "perforacion") {
      const vistaHtml = await fetch("./src/views/dashboard/cliente/agendar/piercing/index.html");
      const html = await vistaHtml.text();
      main.innerHTML = html;
      await seleccionPerforacionController();
    }
    else if(partes[1] == "agendar"){
      const vistaHtml = await fetch("./src/views/dashboard/cliente/agendar/index.html");
      const html = await vistaHtml.text();
      main.innerHTML = html;
      await agendarCitaController();
    }
    else if (partes[1] === "reserva" && partes[2] === "editar") {
      // Editar reserva (cliente/reserva/editar/:id)
      const idCita = partes[3];
      const vistaHtml = await fetch("./src/views/dashboard/cliente/reserva/editar/index.html");
      const html = await vistaHtml.text();
      main.innerHTML = html;
      await editarReservaController(idCita);
    }
    else if (partes[1] === "detalles") {
      const idCita = partes[2];
      const vistaHtml = await fetch("./src/views/dashboard/cliente/reserva/detalles/index.html");
      if (!vistaHtml.ok) throw new Error("No se pudo cargar la vista de detalles");
      const html = await vistaHtml.text();
      main.innerHTML = html;
      await detalleReservaController(idCita);
    } 
    else if (partes[1] === "editar") {
      // Editar detalle (cliente/editar/:id)
      const idDetalle = partes[2];
      const vistaHtml = await fetch("./src/views/dashboard/cliente/reserva/detalles/editar/index.html");
      const html = await vistaHtml.text();
      main.innerHTML = html;
      await editarDetalleController(idDetalle);
    }
  };
  await renderContenido();
};