import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataMenuService } from 'src/app/modulo-principal/Servicios/data-menu.service';
import { LocalstorageService } from 'src/app/modulo-principal/Servicios/localstorage.service';
import { Inventario } from '../../Modelos/inventario';
import { updatePollo } from '../../Modelos/updatePollo';
import { InventarioService } from '../../Servicios/inventario.service';

@Component({
  selector: 'app-ingresar-mercaderia',
  templateUrl: './ingresar-mercaderia.component.html',
  styleUrls: ['./ingresar-mercaderia.component.css']
})
export class IngresarMercaderiaComponent implements OnInit {

  PollosForm:FormGroup;
  update!:updatePollo;
  update2!:updatePollo;
  productLista:Array<Inventario>=new Array();
  constructor(
    private __serviceinven:InventarioService,
    private toast:ToastrService,
    private datas:DataMenuService,
    private route:Router,
    private local:LocalstorageService
  )
  {
    this.PollosForm=this.crearForm();
  }
  ngOnInit() {
  }
 crearForm(){
   return new FormGroup({
     pollo:new FormControl(0,[Validators.required,Validators.min(0)]),
     presa:new FormControl(0,[Validators.required,Validators.max(8),Validators.min(0)]),
     validar:new FormControl()
   });
 }

 ActualizarPollo(){
   if (this.PollosForm.valid){
     this.update=new updatePollo(this.PollosForm.value.pollo,
      this.PollosForm.value.presa)
      if(!this.PollosForm.value.validar){

        this.productLista=this.local.GetStorage("listaProducto");
        var inventario = this.productLista.find((data:Inventario)=> data.producto?.tipo==='mercaderia' )
        
      }else{
        this.__serviceinven.TablePollo(this.update).
        subscribe(()=> this.route.navigate(["ventas/inicio"]));
        this.datas.pollo=this.PollosForm.value.pollo;
        this.datas.presa=this.PollosForm.value.presa;
        this.toast.success("Pollo actualizado","Exitoso");
        this.PollosForm.reset();
      }
   }
 }

}
