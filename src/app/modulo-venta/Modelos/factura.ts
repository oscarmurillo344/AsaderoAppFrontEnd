import { FacturaItems } from "./FacturaItems";

export class Factura{

    private id!:number
    private numeroFactura:number
    private usuarioId:string
    private FormaPago:string
    private FechaIngreso:Date
    private HoraIngreso:Date
    private DiaIngreso:string
    private facturaItem:Array<FacturaItems>

    constructor(numeroFact:number,
                usuarioId:string,
                FormaPago:string,
                DiaIngreso:string,
                facturaItem:Array<FacturaItems>){
        this.numeroFactura = numeroFact;
        this.usuarioId = usuarioId
        this.FormaPago = FormaPago
        this.FechaIngreso = new Date
        this.HoraIngreso = new Date
        this.DiaIngreso = DiaIngreso
        this.facturaItem = facturaItem
    }
}