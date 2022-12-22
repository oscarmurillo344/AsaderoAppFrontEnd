import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Mensaje } from 'src/app/modulo-principal/Modelos/mensaje';
import { Factura } from '../../Modelos/factura';
import { FacturaItems } from '../../Modelos/FacturaItems';
import { FacturaDTO } from '../../Modelos/FaturaDTO';
import { PagarService } from '../../Servicios/pagar.service';

@Component({
  selector: 'app-eliminar-ventas',
  templateUrl: './eliminar-ventas.component.html'
})
export class EliminarVentasComponent implements OnInit {

  ListaFactura!:MatTableDataSource<FacturaItems>;
  factura!:FacturaDTO;
  displayedColumns=['Cantidad','Nombre','PrecioUnitario', 'PrecioTotal'];
  numeroFact:number=0;
  bloqueo:boolean=true;

  constructor(
    private __servicioPago:PagarService,  
    private toast:ToastrService,
    private route:Router
  ) {
  }

  ngOnInit() {
  }

  buscar():void{
    if(this.numeroFact!==0){
      this.__servicioPago.listar(this.numeroFact)
      .subscribe(
        (data:any)=>{
            this.ListaFactura = new MatTableDataSource(data.facturaItem);
            this.factura = data
            this.bloqueo=false;
        });
    }else{
      this.toast.info("numero no valido","Error");
    }
  }

  Eliminar():void{
    if(this.numeroFact!==0){
      this.__servicioPago.eliminar(this.numeroFact)
      .subscribe((data:Mensaje)=>{
        this.toast.success(data.mensaje,"Exitoso");
        this.bloqueo=false;
        this.ListaFactura = new MatTableDataSource();
        this.route.navigate(["ventas/inicio"]);
      });
    }else{
      this.toast.info("numero no valido","Error");
    }
  }

}
