import { FacturaItems } from "./FacturaItems";

export interface Factura{

    id?:number
    numeroFactura:number
    usuarioId:string
    FormaPago:string
    FechaIngreso?:Date
    HoraIngreso?:Date
    DiaIngreso:string
    facturaItem:Array<FacturaItems>
}