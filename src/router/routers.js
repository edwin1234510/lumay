import { dashboardAdminController } from "../views/dashboard/admin/dashboardAdminController"
import { dashboardClienteController } from "../views/dashboard/cliente/dashboardClienteController"
import { loginController } from "../views/login/loginController"
import { registroController } from "../views/registro/registroController"

export const routers = {
    login : {
        path: "login/index.html",
        controller: loginController,
        private: false
    },
    registro:{
        path: "registro/index.html",
        controller: registroController,
        private: false
    },
    cliente: {
        path: "dashboard/cliente/index.html",
        controller: dashboardClienteController,
        private: true
    },
    admin:{
        path: "dashboard/admin/index.html",
        controller: dashboardAdminController,
        private: true
    }
}