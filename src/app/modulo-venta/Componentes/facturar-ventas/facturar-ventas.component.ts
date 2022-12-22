import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Factura } from '../../Modelos/factura';
import { PagarService } from '../../Servicios/pagar.service';
import { FacturaItems } from '../../Modelos/FacturaItems';
import { Mensaje } from 'src/app/modulo-principal/Modelos/mensaje';
import { updatePollo } from 'src/app/modulo-inventario/Modelos/updatePollo';
import { TokenServiceService } from 'src/app/modulo-principal/Servicios/token-service.service';
import { InventarioService } from 'src/app/modulo-inventario/Servicios/inventario.service';
import { DataMenuService } from 'src/app/modulo-principal/Servicios/data-menu.service';
import { LocalstorageService } from 'src/app/modulo-principal/Servicios/localstorage.service';
import { Producto } from 'src/app/modulo-inventario/Modelos/producto';
import { Inventario } from 'src/app/modulo-inventario/Modelos/inventario';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-facturar-ventas',
  templateUrl: './facturar-ventas.component.html',
  styleUrls: ['./facturar-ventas.component.css']
})
export class FacturarVentasComponent implements OnInit {

  total: number = 0;
  valor: number = 0;
  DataCarrito: Array<Inventario> = []
  displayedColumns = ['eliminar', 'nombre', 'precio', 'restar', 'cantidad', 'sumar']
  factura?: Factura;
  listaFacturaItem: Array<FacturaItems> = []
  numeroFactura$!:Observable<number>
  polloMerca: updatePollo = { pollo: 0, presa: 0 }
  bloqueo?: boolean;

  constructor(
    private __servicioPagar: PagarService,
    private mensaje: ToastrService,
    private token: TokenServiceService,
    private route: Router,
    private __serviceInven: InventarioService,
    private __Data: DataMenuService,
    private local: LocalstorageService) { }

  ngOnInit() {
    this.verificarCarrito();
    this.bloqueo = false;
    this.ObtenerNumeroFactura(true)
    this.diaSemana();
  }

  ObtenerNumeroFactura(conCache:boolean): void {
    this.numeroFactura$ = this.__servicioPagar.maximoValor(conCache)
  }

  Facturar() {

    if (this.DataCarrito.length > 0) {
      this.__serviceInven.listarpollo(false).subscribe(data => {
        this.polloMerca = data
        this.listaFacturaItem = []
        if (this.ValidarPollo()) {
          for (let inventario of this.DataCarrito) {
            this.listaFacturaItem.push({
              cantidad: inventario.cantidad!,
              extras: inventario.extras,
              producto: inventario.producto,
              descuento: 0,
              montoPago: inventario.producto.precio
            })
          }
          this.factura = {
            usuario: this.token.getUser(),
            formaPago: "efectivo",
            fechaIngreso: new Date(),
            diaIngreso: this.diaSemana(),
            facturaItem: this.listaFacturaItem
          }
          this.__servicioPagar.pagar(this.factura)
            .subscribe({
              next: (data: Mensaje) => {
                this.mensaje.success(data?.mensaje, "Exitoso");
                this.local.RemoveStorage('DataCarrito');
                this.__Data.Notificacion.emit(1);
              },
              complete: () => {
                this.__serviceInven.IngresarPolloView(this.polloMerca).subscribe(() => this.route.navigate(['/inicio'])                )
                this.ObtenerNumeroFactura(false)
                this.bloqueo = false
              }
            });

        } else {
          this.mensaje.error("No existen pollos", "Error")
          this.bloqueo = false
        }
      });
    } else {
      this.mensaje.error("No existe productos en el carrito", "Error");
    }
  }
  verificarCarrito() {
    if (this.local.GetStorage('DataCarrito')) {
      this.DataCarrito = this.local.GetStorage('DataCarrito');
      this.total = 0; this.valor = 0;

      for (let inventario of this.DataCarrito) {
        this.total += inventario.cantidad!;
        this.valor += (inventario.producto.precio * inventario.cantidad!);
      }
    } else {
      this.total = 0; this.valor = 0;
    }
  }

  Eliminar(index: number) {
    this.DataCarrito.splice(index, 1);
    this.local.SetStorage('DataCarrito', this.DataCarrito);
    this.verificarCarrito();
    this.__Data.Notificacion.emit(1);
  }

  sumar(index: number) {
    this.DataCarrito[index].cantidad!++;
    this.local.SetStorage('DataCarrito', this.DataCarrito);
    this.verificarCarrito();
    this.__Data.Notificacion.emit(1);
  }
  restar(index: number) {
    if (this.DataCarrito[index].cantidad! > 1) {
      this.DataCarrito[index].cantidad!--;
      this.local.SetStorage('DataCarrito', this.DataCarrito);
      this.verificarCarrito();
      this.__Data.Notificacion.emit(1);
    }
  }
  public diaSemana(): any {
    let fecha = new Date()
    let dia = new DatePipe("es")
    return dia.transform(fecha, "EEEE")?.toString()
  }

  ValidarPollo(): boolean {
    let count: number = 0, estado: boolean = false
    this.DataCarrito.forEach(data => {
      count = data.producto.presa * data.cantidad!;
      while (this.polloMerca.presa <= count && this.polloMerca.pollo > 0) {
        this.polloMerca.pollo--
        this.polloMerca.presa += 8
      }
      if (this.polloMerca.presa >= count && this.polloMerca.pollo > 0) {
        this.polloMerca.presa -= count
        estado = true
      }
    })
    return estado
  }

}
