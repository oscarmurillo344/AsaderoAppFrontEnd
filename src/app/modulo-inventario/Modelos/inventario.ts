import { Producto } from './producto';

export interface Inventario {
    id?:number;
    producto:Producto;
    extras:string;
    cantidad?:number;
    cantidadExiste:number;
    cantidadTotal:number;
    estado?:boolean
}