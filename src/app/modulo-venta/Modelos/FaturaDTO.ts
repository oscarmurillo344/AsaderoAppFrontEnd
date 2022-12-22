import { FacturaItems } from "./FacturaItems"

export interface FacturaDTO {

    id?:number
    usuario:string
    cliente?:any
    formaPago:string
    fechaIngreso:Date
    horaIngreso:string
    diaIngreso:string
    subTotalImporte:number
    iva:number
    facturaItem:Array<FacturaItems>
}