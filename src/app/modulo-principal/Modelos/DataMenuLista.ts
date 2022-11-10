import MenuLista from "./MenuList";

export const DataMenuLista: MenuLista[] =
[
  {
    nombre: "Inicio",
    icon:"home",
    default: true,
    ruta: "venta/inicio",
    permisos: ["ROLE_ADMIN","ROLE_USER"]
  },
  {
    nombre: "Inventario",
    icon:"inventory",
    default: true,
    ruta: "inventario/crear",
    permisos: ["ROLE_ADMIN"]

  },
  {
    nombre: "Gastos",
    icon:"pending_actions",
    default: true,
    ruta: "gasto/ingresar",
    permisos: ["ROLE_ADMIN","ROLE_USER"]
  },
  {
    nombre: "Control",
    icon:"trending_up",
    default: true,
    ruta: "control/controlventas",
    permisos: ["ROLE_ADMIN"]

  },
  {
    nombre: "Usuarios",
    icon:"person_add",
    default: true,
    ruta: "auth/usuarios",
    permisos: ["ROLE_ADMIN"]

  },
  {
    nombre: "Cerrar sesion",
    icon:"logout",
    default: true,
    ruta: "auth/login",
    permisos: ["ROLE_ADMIN","ROLE_USER"]

  }
]
