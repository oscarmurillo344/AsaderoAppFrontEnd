import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Inventario } from 'src/app/modulo-inventario/Modelos/inventario';
import { InventarioService } from 'src/app/modulo-inventario/Servicios/inventario.service';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Producto } from '../../Modelos/producto';
import { ProductoListService } from '../../Servicios/producto-list.service';
import { LocalstorageService } from 'src/app/modulo-principal/Servicios/localstorage.service';
import { Mensaje } from 'src/app/modulo-principal/Modelos/mensaje';

@Component({
  selector: 'app-crear-inventario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './crear-inventario.component.html',
  styleUrls: ['./crear-inventario.component.css']
})
export class CrearInventarioComponent implements OnInit, OnChanges {

  ProductForm!: FormGroup;
  @Input() EditordataInventario!: Inventario
  @Output() EditordataInventarioEvent = new EventEmitter<Inventario>();

  EditarEvent = new EventEmitter<Event>();

  ComboInventario: Array<Inventario> = new Array();
  product!: Producto;
  BotonCrearEditar: string = "Nuevo"
  lista: string[] = [];
  private unsuscribir = new Subject<void>();

  constructor(
    private mensaje: ToastrService,
    private __inventarioService: InventarioService,
    private __productoService: ProductoListService,
    private local: LocalstorageService,
    private fb: FormBuilder
  ) {
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes)
    if(this.EditordataInventario?.producto?.nombre.length > 0){
      this.EditarForm(this.EditordataInventario)
      this.BotonCrearEditar = "Editar"
    }else{
      this.CrearForm()
      this.BotonCrearEditar = "Nuevo"
    }
  }

  ngOnDestroy(): void {
    this.unsuscribir.next();
    this.unsuscribir.complete();
  }

  ngOnInit() {
    this.CrearForm()
    this.__inventarioService.EventoCargarInventario.pipe(takeUntil(this.unsuscribir)).
      subscribe(evento => { if (evento == "combo") this.CargarCombo() }
      );
  }


  CargarCombo() {
    this.ComboInventario = this.local.GetStorage("listaProducto");
    this.ComboInventario = this.ComboInventario.filter((data) => data.producto?.tipo !== 'combos' && data.producto.tipo !== "mercaderia")
  }

  CrearForm() {
    this.ProductForm = this.fb.group({
      nombre: new FormControl('', Validators.required),
      tipo: new FormControl('', Validators.required),
      precio: new FormControl('', Validators.required),
      presa: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+')])
    });
  }

  EditarForm(inventario: Inventario) {
    this.ProductForm = this.fb.group({
      nombre: new FormControl(inventario.producto.nombre, Validators.required),
      tipo: new FormControl(inventario.producto.tipo, Validators.required),
      precio: new FormControl(inventario.producto.precio, Validators.required),
      cantidad: new FormControl(inventario.cantidadTotal, [Validators.required, Validators.pattern('^[0-9]+')]),
      presa: new FormControl(inventario.producto.presa, [Validators.required, Validators.pattern('^[0-9]+')])
    });
  }

  cambioFormularioEvent(event:Event): void{
    
  }

  CrearProduct() {
    if (this.ProductForm.valid) {
      this.product = {
        id: 0,
        nombre: this.ProductForm.value.nombre,
        tipo: this.ProductForm.value.tipo,
        precio: this.ProductForm.value.precio,
        presa: this.ProductForm.value.presa
      }

      this.__productoService.nuevoProducto(this.product)
        .subscribe((data: Mensaje) => {
          var inventario: Inventario = {
            id: 0,
            producto: data.cuerpo as Producto,
            extras: this.lista.toString(),
            cantidad: 0,
            cantidadExiste: 0,
            cantidadTotal: 0
          }
          this.__inventarioService.ingresarInventario(inventario).subscribe((data: Mensaje) => {
            this.mensaje.success(data.mensaje, "Exitoso")
            this.ProductForm.reset();
            this.__inventarioService.EventoCargarInventario.emit("CargarInventario")
          });
        })
    }
  }

  ActualizarProduct() {
    if (this.ProductForm.valid) {
      let idProducto = this.EditordataInventario.producto.id || 0;
      let idInventario = this.EditordataInventario.id || 0;
      let producto = {
        id: idProducto,
        nombre: this.ProductForm.value.nombre,
        tipo: this.ProductForm.value.tipo,
        precio: this.ProductForm.value.precio,
        presa: this.ProductForm.value.presa
      }
      forkJoin(this.__productoService.ActualizarProducto(producto),
        this.__inventarioService.UpdateInventario({
          id: idInventario,
          producto,
          extras: this.lista.toString(),
          cantidad: this.ProductForm.value.cantidad,
          cantidadExiste: this.ProductForm.value.cantidad,
          cantidadTotal: this.ProductForm.value.cantidad
        })
      ).subscribe((data: [Mensaje, any]) => {
        this.mensaje.success(data[0].mensaje + ' e ' + data[0].mensaje, "Exitoso");
        this.ProductForm.reset();
        this.__inventarioService.EventoCargarInventario.emit("CargarInventario")
        this.FormularioResetEvento()
      });
    }
  }

  FormularioResetEvento() {
    this.EditordataInventarioEvent.emit({
      cantidad: 0, cantidadExiste: 0, cantidadTotal: 0, extras: "", producto: {
        nombre: "", tipo: "", precio: 0, presa: 0
      }
    })
  }

  public valueChange($event: any) {
    if ($event.checked) {
      this.lista.push($event.source.value);
    } else if ($event.checked === false) {
      this.lista.forEach((data: string, i: number) => data == $event.source.value ? this.lista.splice(i, 1) : undefined)
    }
  }

}
