import { headerController } from "../../../componentes/headerController";

export const dashboardClienteController = async () => {
  const header = document.querySelector("#header");

  const headerHtml = await fetch("./src/componentes/header.html").then(r => r.text());
  header.innerHTML = headerHtml;

  await headerController();

  const sidebar = document.querySelector("#sidebar");
  const sidebarHtml = await fetch("./src/componentes/sidebarCliente.html").then(r => r.text());
  sidebar.innerHTML = sidebarHtml;
};