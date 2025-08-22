import { headerController } from "../../../componentes/headerController";

export const dashboardAdminController = async() =>{

    const header = document.querySelector("#header");
    const headerHtml = await fetch("./src/componentes/headerAdmin.html").then(r => r.text());
    header.innerHTML = headerHtml;
    await headerController();

    const sidebar = document.querySelector("#sidebar");
    const sidebarHtml = await fetch("./src/componentes/sidebarAdmin.html").then(r => r.text());
    sidebar.innerHTML = sidebarHtml;

}