import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Factura } from '../../Modelos/factura';
import { PagarService } from '../../Servicios/pagar.service';
import { FacturaItems } from '../../Modelos/FacturaItems';
import { ListaProducto } from 'src/app/modulo-inventario/Modelos/lista-producto';
import { Mensaje } from 'src/app/modulo-principal/Modelos/mensaje';
import { updatePollo } from 'src/app/modulo-inventario/Modelos/updatePollo';
import { TokenServiceService } from 'src/app/modulo-principal/Servicios/token-service.service';
import { InventarioService } from 'src/app/modulo-inventario/Servicios/inventario.service';
import { DataMenuService } from 'src/app/modulo-principal/Servicios/data-menu.service';
import { LocalstorageService } from 'src/app/modulo-principal/Servicios/localstorage.service';
import { Producto } from 'src/app/modulo-inventario/Modelos/producto';
import { Inventario } from 'src/app/modulo-inventario/Modelos/inventario';

@Component({
  selector: 'app-facturar-ventas',
  templateUrl: './facturar-ventas.component.html',
  styleUrls: ['./facturar-ventas.component.css']
})
export class FacturarVentasComponent implements OnInit {

  total: number = 0;
  valor: number = 0;
  listaProducto: Array<Inventario>
  displayedColumns = ['eliminar', 'nombre', 'restar', 'cantidad!', 'sumar']
  factura?: Factura;
  listaFacturaItem: Array<FacturaItems>
  numeroFactura: number = 0
  mms!: Mensaje;
  contador: number = 0;
  polloMerca: updatePollo;
  bloqueo?: boolean;

  constructor(private __servicioPagar: PagarService,
    private mensaje: ToastrService,
    private token: TokenServiceService,
    private route: Router,
    private __serviceInven: InventarioService,
    private __Data: DataMenuService,
    private local: LocalstorageService) {
    this.listaProducto = new Array()
    this.listaFacturaItem = Array()
    this.polloMerca = new updatePollo(0, 0)
  }

  ngOnInit() {
    this.verificarCarrito();
    this.bloqueo = false;
    this.numeroFactura = this.local.GetStorage("nfactura") as number
    if (this.numeroFactura == undefined) {
      this.__servicioPagar.maximoValor()
        .subscribe((data: number) => {
          this.numeroFactura = data;
          this.numeroFactura += 1;
          this.local.SetStorage("nfactura", this.numeroFactura)
        }, () => this.numeroFactura = 0)
    }
    this.diaSemana();
  }
  Facturar(): void {

    if (this.listaProducto.length > 0) {
      this.polloMerca = this.local.GetStorage("pollos");
      if (this.ValidarPollo()) {
        this.contador = this.listaProducto.length - 1;
        for (let index = 0; index < this.listaProducto.length; index++) {
          this.listaFacturaItem.push(new FacturaItems(this.listaProducto[index].cantidad!,
            this.listaProducto[index].extras,
            this.listaProducto[index].producto,
            0,
            this.listaProducto[index].producto.precio))
        }
        this.factura = new Factura(
          this.numeroFactura,
          this.token.getUser(),
          "Efectivo",
          this.diaSemana(), this.listaFacturaItem);

        this.__servicioPagar.pagar(this.factura)
          .subscribe(data => {
            this.mms = data;
            this.mensaje.success(this.mms.mensaje, "Exitoso");
            this.local.RemoveStorage('DataCarrito');
            this.__serviceInven.TablePollo(this.polloMerca).subscribe(data => null)
            this.local.SetStorage("nfactura", undefined)
            this.__Data.Notificacion.emit(1);
            this.route.navigate(['/inicio']);
            this.bloqueo = false;
          }, () => this.bloqueo = false);

      } else {
        this.mensaje.error("No existen pollos", "Error")
        this.bloqueo = false
      }
    } else {
      this.mensaje.error("No existe productos en el carrito", "Error");
    }
  }
  verificarCarrito() {
    if (this.local.GetStorage('DataCarrito')) {
      this.listaProducto = this.local.GetStorage('DataCarrito');
      this.total = 0; this.valor = 0;

      for (var i = 0; i < this.listaProducto.length; i++) {
        this.total += this.listaProducto[i].cantidad!;
        this.valor += (this.listaProducto[i].producto.precio * this.listaProducto[i].cantidad!);
      }
    } else {
      this.total = 0; this.valor = 0;
    }
  }
  Eliminar(index: number) {
    this.listaProducto.splice(index, 1);
    this.local.SetStorage('DataCarrito', this.listaProducto);
    this.verificarCarrito();
    this.__Data.Notificacion.emit(1);
  }
  sumar(index: number) {
    this.listaProducto[index].cantidad!++;
    this.local.SetStorage('DataCarrito', this.listaProducto);
    this.verificarCarrito();
    this.__Data.Notificacion.emit(1);
  }
  restar(index: number) {
    if (this.listaProducto[index].cantidad! > 1) {
      this.listaProducto[index].cantidad!--;
      this.local.SetStorage('DataCarrito', this.listaProducto);
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
    this.listaProducto.forEach(data => {
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
