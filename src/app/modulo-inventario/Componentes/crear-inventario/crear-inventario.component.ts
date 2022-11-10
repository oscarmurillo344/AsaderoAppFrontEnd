import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Inventario } from 'src/app/modulo-inventario/Modelos/inventario';
import { InventarioService } from 'src/app/modulo-inventario/Servicios/inventario.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Producto } from '../../Modelos/producto';
import { ProductoListService } from '../../Servicios/producto-list.service';
import { LocalstorageService } from 'src/app/modulo-principal/Servicios/localstorage.service';
import { Mensaje } from 'src/app/modulo-principal/Modelos/mensaje';

@Component({
  selector: 'app-crear-inventario',
  templateUrl: './crear-inventario.component.html',
  styleUrls: ['./crear-inventario.component.css']
})
export class CrearInventarioComponent implements OnInit {

  ProductForm :FormGroup;
  ComboInventario:Array<Inventario>=new Array();
  product!:Producto;
  lista:string[]=[];
  private unsuscribir = new Subject<void>();

  constructor(
    private mensaje:ToastrService,
    private __inventarioService:InventarioService,
    private __productoService:ProductoListService,
    private local:LocalstorageService
    ) {
      this.ProductForm=this.createForm();
  }

  ngOnDestroy(): void {
    this.unsuscribir.next();
    this.unsuscribir.complete();
  }

  ngOnInit() {
    this.__inventarioService.EventoCargarInventario.pipe(takeUntil(this.unsuscribir)).
    subscribe(evento=>evento=="combo"?this.CargarCombo():null);
  }


  CargarCombo(){
      this.ComboInventario=this.local.GetStorage("listaProducto");
      this.ComboInventario.forEach((data,index)=> data.producto?.tipo=='combos' ? this.ComboInventario.splice(index,1):undefined)
  }
  createForm(){
    return new FormGroup({
      nombre: new FormControl('',Validators.required),
      tipo: new FormControl('',Validators.required),
      precio: new FormControl('',Validators.required),
      presa: new FormControl('',[Validators.required,Validators.pattern('^[0-9]+')])
    });
  }

  CrearProduct(){
    if(this.ProductForm.valid){
      this.product=new Producto(0,
        this.ProductForm.value.nombre,
        this.ProductForm.value.tipo,
        this.ProductForm.value.precio,
        this.ProductForm.value.presa);

    this.__productoService.nuevoProducto(this.product)
     .subscribe((data:Mensaje)=>{
      var inventario:Inventario = {
        producto: data.cuerpo as Producto,
        extras:this.lista.toString(),
        cantidad: 0,
        cantidadExiste: 0,
        cantidadTotal: 0
      }
        this.__inventarioService.ingresarInventario(inventario).subscribe((data:Mensaje)=>{
        this.mensaje.success(data.mensaje,"Exitoso")
        this.ProductForm.reset();
        this.__inventarioService.EventoCargarInventario.emit("CargarInventario")
      });
      })
    }
  }
  public valueChange($event:any){
    if($event.checked){
      this.lista.push($event.source.value);
    }else if($event.checked===false){
      this.lista.forEach((data:string,i:number)=> data==$event.source.value ? this.lista.splice(i,1):undefined)
    }
  }

}
