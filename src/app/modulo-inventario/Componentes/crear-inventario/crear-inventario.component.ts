import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Inventario } from 'src/app/modulo-inventario/Modelos/inventario';
import { InventarioService } from 'src/app/modulo-inventario/Servicios/inventario.service';
import { forkJoin, Subject } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { takeUntil } from 'rxjs/operators';
import { Producto } from '../../Modelos/producto';
import { ProductoListService } from '../../Servicios/producto-list.service';
import { LocalstorageService } from 'src/app/modulo-principal/Servicios/localstorage.service';
import { Mensaje } from 'src/app/modulo-principal/Modelos/mensaje';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-crear-inventario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './crear-inventario.component.html',
  styleUrls: ['./crear-inventario.component.css']
})
export class CrearInventarioComponent implements OnInit, OnChanges {

  separatorKeysCodes: number[] = [ENTER, COMMA];
  ProductForm!: FormGroup;
  @Input() EditordataInventario!: Inventario
  @Output() EditordataInventarioEvent = new EventEmitter<Inventario>();
  @Input() ListaInventario: Array<Inventario> = []
  @Output() ListaInventarioEvent = new EventEmitter<boolean>();
  @ViewChild('inventarioInput') InventarioInput!: ElementRef<HTMLInputElement>;
  BotonCrearEditar: string = "Nuevo"
  ListaInventarioCombo:Inventario[] = []
  itemsProducto: any[] = [];
  private unsuscribir = new Subject<void>();

  constructor(
    private mensaje: ToastrService,
    private __inventarioService: InventarioService,
    private __productoService: ProductoListService,
    private fb: FormBuilder
  ) {
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.itemsProducto = []
    if (this.EditordataInventario?.producto?.nombre.length > 0) {
      this.EditarForm(this.EditordataInventario)
      this.BotonCrearEditar = "Editar"
    } else {
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
    this.EditarCombo()
  }

  EditarCombo() {
    this.ListaInventarioCombo = this.ListaInventario.filter((data) => data.producto?.tipo !== 'combos' && data.producto.tipo !== "mercaderia")
  }



  CrearForm() {
    this.ProductForm = this.fb.group({
      nombre: ['', Validators.required],
      tipo: ['', Validators.required],
      itemsProducto: [""],
      precio: ['', Validators.required],
      presa: ['', [Validators.required, Validators.pattern('^[0-9]+')]]
    });
  }

  EditarForm(inventario: Inventario) {
    inventario.extras.split(',').forEach(item => {
      let invent = this.ListaInventario.find(f => f.id == Number(item))
      this.itemsProducto.push({
        id: invent?.id,
        nombre: invent?.producto.nombre
      })
    })
    this.ProductForm = this.fb.group({
      nombre: [inventario.producto.nombre, Validators.required],
      tipo: [inventario.producto.tipo, Validators.required],
      itemsProducto: [""],
      precio: [inventario.producto.precio, Validators.required],
      cantidad: [inventario.cantidadTotal, [Validators.required, Validators.pattern('^[0-9]+')]],
      presa: [inventario.producto.presa, [Validators.required, Validators.pattern('^[0-9]+')]]
    });
  }

  resetInputs(): void {
    this.InventarioInput.nativeElement.value = ''
    this.ProductForm.get('itemsProducto')!.setValue(null);
  }

  remove(control: Inventario): void {
    this.itemsProducto = this.itemsProducto.filter((data: any) => data.id != control.id)
    this.resetInputs()
  }

  SeleccionControl(event: MatAutocompleteSelectedEvent): void {
    let idInventario = event.option.value as number
    let inventario = this.ListaInventario.find((data: Inventario) => data.id == idInventario)
    if (!this.itemsProducto.find(data => data.id == idInventario)) {
      this.itemsProducto.push({
        id: inventario!.id,
        nombre: inventario!.producto.nombre
      })
      this.resetInputs()
    }
  }

  CrearProduct() {
    if (this.ProductForm.valid) {
      let product:Producto = {
        id: 0,
        nombre: this.ProductForm.value.nombre,
        tipo: this.ProductForm.value.tipo,
        precio: this.ProductForm.value.precio,
        presa: this.ProductForm.value.presa
      }
      let extras = this.itemsProducto.map(d => d.id).toString()

      this.__productoService.nuevoProducto(product)
        .subscribe((data: Mensaje) => {
          var inventario: Inventario = {
            id: 0,
            producto: data.cuerpo as Producto,
            extras: extras,
            cantidad: 0,
            cantidadExiste: 0,
            cantidadTotal: 0
          }
          this.__inventarioService.ingresarInventario(inventario).subscribe((data: Mensaje) => {
            this.mensaje.success(data.mensaje, "Exitoso")
            this.ProductForm.reset();
            this.itemsProducto = []
            this.ListaInventarioEvent.emit(false)
            this.__inventarioService.AccionListaInventario.emit(false)
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
      let extras = this.itemsProducto.map(d => d.id).toString()

      forkJoin(this.__productoService.ActualizarProducto(producto),
        this.__inventarioService.UpdateInventario({
          id: idInventario,
          producto,
          extras: extras,
          cantidad: this.ProductForm.value.cantidad,
          cantidadExiste: this.ProductForm.value.cantidad,
          cantidadTotal: this.ProductForm.value.cantidad
        })
      ).subscribe((data: [Mensaje, any]) => {
        this.mensaje.success(data[0].mensaje + ' e ' + data[0].mensaje, "Exitoso");
        this.ProductForm.reset();
        this.itemsProducto = []
        this.FormularioResetEvento()
        this.ListaInventarioEvent.emit(false)
        this.__inventarioService.AccionListaInventario.emit(false)
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

}
