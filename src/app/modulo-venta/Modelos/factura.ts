import { FacturaItems } from "./FacturaItems";

export interface Factura{

    id?:number
    usuario:string
    cliente?:any
    formaPago:string
    fechaIngreso?:Date
    horaIngreso?:string
    diaIngreso:string
    facturaItem:Array<FacturaItems>
}