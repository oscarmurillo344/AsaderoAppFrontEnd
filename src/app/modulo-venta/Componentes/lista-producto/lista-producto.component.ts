import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Inventario } from 'src/app/modulo-inventario/Modelos/inventario';
import { Producto } from 'src/app/modulo-inventario/Modelos/producto';
import { DataMenuService } from 'src/app/modulo-principal/Servicios/data-menu.service';
import { LocalstorageService } from 'src/app/modulo-principal/Servicios/localstorage.service';
import { InventarioVista } from '../../Modelos/InventarioVista';

@Component({
  selector: 'app-lista-producto',
  templateUrl: './lista-producto.component.html',
  styleUrls: ['./lista-producto.component.css']
})
export class ListaProductoComponent implements OnInit {

  @Input() listaInventario!: InventarioVista
  @Input() carrito: Array<Inventario> = []
  @Input() tipo: String = ""
  displayedColumns: string[] = ['agregar', 'Nombre', 'sumar']


  constructor(
    private mensaje: ToastrService,
    private _dataMenu: DataMenuService,
    private local: LocalstorageService,
  ) { }

  ngOnInit(): void {
  }

  sumar(inventario: Inventario): void {
    this.listaInventario.inventario.find((valor, index: number) => valor.producto === inventario.producto ?
      this.listaInventario.inventario[index].cantidad!++ : null)
  }

  restar(inventario: Inventario): void {
    this.listaInventario.inventario.find((valor, index: number) => valor.producto === inventario.producto && valor.cantidad! > 1 ?
      this.listaInventario.inventario[index].cantidad!-- : null)
  }

  AgregarCarrito(inventario: Inventario): void {

    if (this.verificar(inventario))
      this.carrito.push(inventario)

    if (inventario.cantidadExiste <= 0)
      this.mensaje.warning(`Actualice inventario de ${inventario.producto.nombre}`, 'Advertencia')
    else
      this.mensaje.success(`Se agrego ${inventario.producto.nombre} al carrito`, 'Exitoso')

    this.local.SetStorage('DataCarrito', this.carrito);
    this._dataMenu.Notificacion.emit(1);
  }

  verificar(inventario: Inventario): boolean {
    let val: boolean = true;
    let compras = this.local.GetStorage("DataCarrito") as Inventario[]
    if (compras?.length > 0) {
      this.carrito = compras.map(valor => {
        if (valor.id === inventario.id){
          valor.cantidad!++
          val = false
        }
        return valor
      })
    }
    return val;
  }

}
