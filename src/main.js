import { router } from "./router/router";
import './estilos/style.css';

const app = document.querySelector("#contenido-dinamico")

window.addEventListener("DOMContentLoaded", ()=> {
    router(app)
})
window.addEventListener("hashchange", ()=>{
    router(app)
})
