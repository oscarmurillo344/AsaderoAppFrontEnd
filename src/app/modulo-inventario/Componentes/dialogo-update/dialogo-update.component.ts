import { Component, OnInit,Inject, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {MAT_DIALOG_DATA  } from  '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Subject } from 'rxjs';
import { Inventario } from 'src/app/modulo-inventario/Modelos/inventario';
import { Producto } from '../../Modelos/producto';
import { ProductoListService } from '../../Servicios/producto-list.service';
import { InventarioService } from '../../Servicios/inventario.service';
import { LocalstorageService } from 'src/app/modulo-principal/Servicios/localstorage.service';
import { Mensaje } from 'src/app/modulo-principal/Modelos/mensaje';



@Component({
  selector: 'app-dialogo-update',
  templateUrl: './dialogo-update.component.html',
  styleUrls: ['./dialogo-update.component.css']
})
export class DialogoUpdateComponent implements OnInit,OnDestroy {

  UpdateProductForm: FormGroup;
  inventario:Inventario;
  ListaInventario:Array<Inventario>=new Array();
  lista:string[]=[];
  CombInventario:Array<Inventario>;
  private unsuscribir = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data:Inventario,
    private __servicioProduct:ProductoListService,
    private __servicioInventario:InventarioService,
    private mensaje:ToastrService,
    private local:LocalstorageService
  ) {
    this.UpdateProductForm=this.crearForm(data);
    this.inventario=data;
    this.CombInventario=new Array();
    this.CargarCombo();
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.unsuscribir.next();
    this.unsuscribir.complete();
  }

  crearForm(data:any){
    if(data.extras!==null && data.extras != ""){
      let ex:string=data.extras;
      this.lista=ex.split(",")
    }else{
      this.lista=[]
    }

    return new FormGroup({
      nombre: new FormControl(data.producto.nombre,Validators.required),
      tipo: new FormControl(data.producto.tipo,Validators.required),
      cantidad:new FormControl(data.cantidad,[Validators.required,Validators.pattern('^[0-9]+')]),
      precio: new FormControl(data.producto.precio,Validators.required),
      presa: new FormControl(data.producto.presa,[Validators.required,Validators.pattern('^[0-9]+')])
    });
  }

  ActualizarProduct(){
    if(this.UpdateProductForm.valid){
     let idProducto=this.inventario.producto.id || 0;
     let idInventario=this.inventario.id || 0;
    let producto=new Producto(idProducto,
        this.UpdateProductForm.value.nombre,this.UpdateProductForm.value.tipo,
        this.UpdateProductForm.value.precio,this.UpdateProductForm.value.presa);
        forkJoin( this.__servicioProduct.ActualizarProducto(producto),
        this.__servicioInventario.UpdateInventario({
          id: idInventario,
          producto,
          extras: this.lista.toString(),
          cantidad: this.UpdateProductForm.value.cantidad,
          cantidadExiste: this.UpdateProductForm.value.cantidad,
          cantidadTotal: this.UpdateProductForm.value.cantidad
         })
        ).subscribe((data:[Mensaje,any])=>{
            this.mensaje.success(data[0].mensaje+' e '+data[0].mensaje,"Exitoso");
            this.__servicioInventario.EventoCargarInventario.emit("CargarInventario")
      });
    }
  }

  ValorCambio($event:any):void{
    if($event.checked)
    this.lista.push(""+$event.source.value)
    else if($event.checked===false)
    this.lista.forEach((data:string,i:number)=> data==$event.source.value ?  this.lista.splice(i,1) : null)
  }

  CargarCombo():void{
    this.CombInventario=this.local.GetStorage("listaProducto");
    this.CombInventario.forEach((data,index)=> data.producto?.tipo=='combos'? this.CombInventario.splice(index,1): undefined)
    this.estadoProducto(this.lista,this.CombInventario)
  }

  estadoProducto(ver:string[],data:Inventario[]):void{
    data.forEach(da=>{
      ver.find((filtro:any)=>{
        if(da.id == filtro){
          return da.estado=true
        }else{
          return da.estado=false
        }
      })
    })
  }
}
