// Importación de todos los controladores utilizados en el sistema.
// Cada controlador gestiona la lógica de las vistas según el rol (cliente o admin).
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


/**
 * Objeto principal de enrutamiento de la aplicación.
 * 
 * Define las rutas disponibles para clientes y administradores,
 * asignando la vista (path), el controlador encargado de la lógica
 * y el nivel de acceso (público/privado o permisos específicos).
 */
export const routers = {
  // Rutas públicas
  login: {
    path: "login/index.html",      // Ruta hacia la vista de login
    controller: loginController,   // Controlador que gestiona el login
    private: false,                // Acceso público
  },
  registro: {
    path: "registro/index.html",   // Ruta hacia la vista de registro
    controller: registroController,// Controlador que gestiona el registro
    private: false,                // Acceso público
  },

  // Rutas de clientes (requieren estar autenticado)
  cliente: {
    path: "dashboard/cliente/index.html",
    controller: dashboardClienteController,
    private: true,                 // Solo usuarios logueados
    routes: {
      agendar: {
        path: "dashboard/cliente/agendar/index.html",
        controller: agendarCitaController,
        can: "cita.crear"          // Permiso necesario para agendar cita
      },
      "agendar/perforacion": {
        path: "dashboard/cliente/agendar/piercing/index.html",
        controller: seleccionPerforacionController,
        can: "detalle.crear"       // Permiso para elegir perforación
      },
      galeria: {
        path: "dashboard/cliente/galeria/index.html",
        controller: clienteGaleriaController,
        can: "galeria.index"       // Permiso para ver galería
      },
      perfil: {
        path: "dashboard/cliente/perfil/index.html",
        controller: perfilController,
        can: "perfil.editar"       // Permiso para editar perfil
      },
      reserva: {
        path: "dashboard/cliente/reserva/index.html",
        controller: reservaController,
        can: "cita.index"          // Permiso para ver reservas
      },
      "reserva/editar/:id": {
        path: "dashboard/cliente/reserva/editar/index.html",
        // Controlador recibe como parámetro el id de la reserva
        controller: (main, params) => editarReservaController(params[0]),
        can: "cita.editar"         // Permiso para editar cita
      },
      "detalles/:id": {
        path: "dashboard/cliente/reserva/detalles/index.html",
        controller: (main, params) => detalleReservaController(params[0]),
        can: "detalle.index"       // Permiso para ver detalles de la reserva
      },
      "detalles/editar/:id": {
        path: "dashboard/cliente/reserva/detalles/editar/index.html",
        controller: (main, params) => editarDetalleController(params[0]),
        can: "detalle.editar"      // Permiso para editar detalles de la reserva
      },
    },
  },

  // Rutas de administradores (requieren autenticación y permisos específicos)
  admin: {
    path: "dashboard/admin/index.html",
    controller: dashboardAdminController,
    private: true,
    routes: {
      usuarios: {
        path: "dashboard/admin/usuarios/index.html",
        controller: usuarioController,
        can: "usuario.index"       // Permiso para ver usuarios
      },
      "usuarios/editar/:id": {
        path: "dashboard/admin/usuarios/editar/index.html",
        controller: (main, params) => usuarioEditarController(params[0]),
        can: "usuarios.editar"     // Permiso para editar usuario
      },
      perfil: {
        path: "dashboard/admin/perfil/index.html",
        controller: perfilController,
        can: "perfil.editar"
      },
      zona: {
        path: "dashboard/admin/zona/index.html",
        controller: adminZonaController,
        can: "zona.index"
      },
      "zona/nuevo": {
        path: "dashboard/admin/zona/formularioZona/index.html",
        controller: crearZona,
        can: "zona.crear"
      },
      "zona/editar/:id": {
        path: "dashboard/admin/zona/formularioZona/index.html",
        controller: (main, params) => editarZona(params[0]),
        can: "zona.editar"
      },
      material: {
        path: "dashboard/admin/material/index.html",
        controller: adminMaterialController,
        can: "material.index"
      },
      "material/nuevo": {
        path: "dashboard/admin/material/formulario/index.html",
        controller: crearMaterialController,
        can: "material.crear"
      },
      "material/editar/:id": {
        path: "dashboard/admin/material/formulario/index.html",
        controller: (main, params) => editarMaterialController(params[0]),
        can: "material.editar"
      },
      piercing: {
        path: "dashboard/admin/piercing/index.html",
        controller: adminPiercingController,
        can: "piercing.index"
      },
      "piercing/nuevo": {
        path: "dashboard/admin/piercing/formularioPiercing/index.html",
        controller: piercingController,
        can: "piercing.crear"
      },
      "piercing/editar/:id": {
        path: "dashboard/admin/piercing/formularioPiercing/index.html",
        controller: (main, params) => editarPiercingController(params[0]),
        can: "piercing.editar"
      },
      galeria: {
        path: "dashboard/admin/galeria/index.html",
        controller: adminGaleriaController,
        can: "galeria.index"
      },
      "galeria/detalles/:id": {
        path: "dashboard/admin/galeria/detalles/index.html",
        controller: (main, params) => galeriaDetalleController(params[0]),
        can: "galeria.editar"
      },
      "galeria/nueva": {
        path: "dashboard/admin/galeria/nueva/index.html",
        controller: crearCarta,
        can: "galeria.crear"
      },
      reservas: {
        path: "dashboard/admin/reservas/index.html",
        controller: adminCalendarioController,
        can: "cita.index"
      },
      "reservas/editar/:id": {
        path: "dashboard/cliente/reserva/editar/index.html", 
        controller: (main, params) => editarReservasAdmin(params[0]),
        can: "estado.editar"
      },
    },
  },
};
