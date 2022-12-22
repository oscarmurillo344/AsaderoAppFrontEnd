import { Producto } from "src/app/modulo-inventario/Modelos/producto";

export interface FacturaItems {
    id?:number;
    cantidad:number
    extras:string;
    producto:Producto;
    descuento:number;
    montoPago:number;
}
