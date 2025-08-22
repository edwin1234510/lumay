import { dashboardClienteController } from "../views/dashboard/cliente/dashboardClienteController";
import { agendarCitaController } from "../views/dashboard/cliente/agendar/agendarController";
import { seleccionPerforacionController } from "../views/dashboard/cliente/agendar/piercing/piercingAgendarController";
import { clienteGaleriaController } from "../views/dashboard/cliente/galeria/clienteGaleria";
import { perfilController } from "../views/dashboard/cliente/perfil/perfilController";
import { reservaController } from "../views/dashboard/cliente/reserva/reservaController";
import { detalleReservaController } from "../views/dashboard/cliente/reserva/detalles/detalleReservaController";
import { editarDetalleController } from "../views/dashboard/cliente/reserva/detalles/editar/editarDetalleController";
import { editarReservaController } from "../views/dashboard/cliente/reserva/editar/editarReservaController";

import { dashboardAdminController } from "../views/dashboard/admin/dashboardAdminController";
import { loginController } from "../views/login/loginController";
import { registroController } from "../views/registro/registroController";
import { usuarioController } from "../views/dashboard/admin/usuarios/usuarioController";
import { usuarioEditarController } from "../views/dashboard/admin/usuarios/editar/usuarioEditarController";
import { adminZonaController } from "../views/dashboard/admin/zona/adminZonaController";
import { crearZona } from "../views/dashboard/admin/zona/formularioZona/CrearZona";
import { adminMaterialController } from "../views/dashboard/admin/material/adminMaterial";
import { crearMaterialController } from "../views/dashboard/admin/material/formulario/crearMaterial";
import { editarMaterialController } from "../views/dashboard/admin/material/formulario/editarMaterial";
import { adminPiercingController } from "../views/dashboard/admin/piercing/adminPiercing";
import { piercingController } from "../views/dashboard/admin/piercing/formularioPiercing/piercingController";
import { editarPiercingController } from "../views/dashboard/admin/piercing/formularioPiercing/editarPiercingController";
import { adminGaleriaController } from "../views/dashboard/admin/galeria/adminGaleriaController";
import { galeriaDetalleController } from "../views/dashboard/admin/galeria/detalles/galeriaDetalles";
import { crearCarta } from "../views/dashboard/admin/galeria/nueva/nuevaCarta";
import { adminCalendarioController } from "../views/dashboard/admin/reservas/adminReservasController";
import { editarReservasAdmin } from "../views/dashboard/admin/reservas/editarReservas";
import { editarZona } from "../views/dashboard/admin/zona/formularioZona/editarZona";


export const routers = {
  login: {
    path: "login/index.html",
    controller: loginController,
    private: false,
  },
  registro: {
    path: "registro/index.html",
    controller: registroController,
    private: false,
  },
  cliente: {
    path: "dashboard/cliente/index.html",
    controller: dashboardClienteController,
    private: true,
    routes: {
      agendar: {
        path: "dashboard/cliente/agendar/index.html",
        controller: agendarCitaController,
      },
      "agendar/perforacion": {
        path: "dashboard/cliente/agendar/piercing/index.html",
        controller: seleccionPerforacionController,
      },
      galeria: {
        path: "dashboard/cliente/galeria/index.html",
        controller: clienteGaleriaController,
      },
      perfil: {
        path: "dashboard/cliente/perfil/index.html",
        controller: perfilController,
      },
      reserva: {
        path: "dashboard/cliente/reserva/index.html",
        controller: reservaController,
      },
      "reserva/editar/:id": {
        path: "dashboard/cliente/reserva/editar/index.html",
        controller: (main, params) => editarReservaController(params[0]),
      },
      "detalles/:id": {
        path: "dashboard/cliente/reserva/detalles/index.html",
        controller: (main, params) => detalleReservaController(params[0]),
      },
      "detalles/editar/:id": {
        path: "dashboard/cliente/reserva/detalles/editar/index.html",
        controller: (main, params) => editarDetalleController(params[0]),
      },
    },
  },
  admin: {
    path: "dashboard/admin/index.html",
    controller: dashboardAdminController,
    private: true,
    routes: {
      usuarios: {
        path: "dashboard/admin/usuarios/index.html",
        controller: usuarioController,
      },
      "usuarios/editar/:id": {
        path: "dashboard/admin/usuarios/editar/index.html",
        controller: (main, params) => usuarioEditarController(params[0]),
      },
      perfil: {
        path: "dashboard/admin/perfil/index.html",
        controller: perfilController,
      },
      zona: {
        path: "dashboard/admin/zona/index.html",
        controller: adminZonaController,
      },
      "zona/nuevo": {
        path: "dashboard/admin/zona/formularioZona/index.html",
        controller: crearZona,
      },
      "zona/editar/:id": {
        path: "dashboard/admin/zona/formularioZona/index.html",
        controller: (main, params) => editarZona(params[0]),
      },
      material: {
        path: "dashboard/admin/material/index.html",
        controller: adminMaterialController,
      },
      "material/nuevo": {
        path: "dashboard/admin/material/formulario/index.html",
        controller: crearMaterialController,
      },
      "material/editar/:id": {
        path: "dashboard/admin/material/formulario/index.html",
        controller: (main, params) => editarMaterialController(params[0]),
      },
      piercing: {
        path: "dashboard/admin/piercing/index.html",
        controller: adminPiercingController,
      },
      "piercing/nuevo": {
        path: "dashboard/admin/piercing/formularioPiercing/index.html",
        controller: piercingController,
      },
      "piercing/editar/:id": {
        path: "dashboard/admin/piercing/formularioPiercing/index.html",
        controller: (main, params) => editarPiercingController(params[0]),
      },
      galeria: {
        path: "dashboard/admin/galeria/index.html",
        controller: adminGaleriaController,
      },
      "galeria/detalles/:id": {
        path: "dashboard/admin/galeria/detalles/index.html",
        controller: (main, params) => galeriaDetalleController(params[0]),
      },
      "galeria/nueva": {
        path: "dashboard/admin/galeria/nueva/index.html",
        controller: crearCarta,
      },
      reservas: {
        path: "dashboard/admin/reservas/index.html",
        controller: adminCalendarioController,
      },
      "reservas/editar/:id": {
        path: "dashboard/cliente/reserva/editar/index.html", // ojo, usas vista cliente
        controller: (main, params) => editarReservasAdmin(params[0]),
      },
    },
  },
};
