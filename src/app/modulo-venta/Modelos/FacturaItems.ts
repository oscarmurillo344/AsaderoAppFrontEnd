import { Producto } from "src/app/modulo-inventario/Modelos/producto";

export class FacturaItems {

    private id!:number;
    private cantidad:number;
    private extras:string;
    private producto:Producto;
    private Descuento:number;
    private MontoPago:number;

    constructor (cantidad:number,
                extras:string,
                producto:Producto,
                Descuento:number,
                MontoPago:number){
        this.cantidad = cantidad
        this.extras= extras
        this.producto = producto
        this.Descuento = Descuento
        this.MontoPago = MontoPago
    }
}
