import { Component, OnInit, OnDestroy, AfterContentInit } from '@angular/core';
import { Inventario } from 'src/app/modulo-inventario/Modelos/inventario';
import { updatePollo } from 'src/app/modulo-inventario/Modelos/updatePollo';
import { InventarioService } from 'src/app/modulo-inventario/Servicios/inventario.service';
import { DataMenuService } from 'src/app/modulo-principal/Servicios/data-menu.service';
import { LocalstorageService } from 'src/app/modulo-principal/Servicios/localstorage.service';
import { TokenServiceService } from 'src/app/modulo-principal/Servicios/token-service.service';
import { InventarioVista } from '../../Modelos/InventarioVista';


@Component({
  selector: 'app-principal-ventas',
  templateUrl: './principal-ventas.component.html'
})
export class PrincipalVentasComponent implements OnInit, OnDestroy {

  ObjetoTabla: InventarioVista[] = []
  carrito: Array<Inventario> = []
  update?: updatePollo
  TiempoFuera!: NodeJS.Timeout

  constructor(
    private __servicioPro: InventarioService,
    private token: TokenServiceService,
    private _dataMenu: DataMenuService,
    private local: LocalstorageService,
  ) {
  }

  ngOnDestroy(): void {
    clearTimeout(this.TiempoFuera)
  }

  ngOnInit() {
    this.llenarListas()
    if (this.local.GetStorage('DataCarrito')) this.carrito = this.local.GetStorage('DataCarrito');
    this.__servicioPro.listarpollo()
      .subscribe((data: updatePollo) => {
        this._dataMenu.pollo = data.pollo;
        this._dataMenu.presa = data.presa;
        this.local.SetStorage("pollos", new updatePollo(this._dataMenu.pollo, this._dataMenu.presa));
      })
    this.TiempoFuera = setTimeout(() => {
      if (this.token.getToken() && !this.token.TokenExpirado()) {
        this._dataMenu.AbrirMenu()
        this._dataMenu.SetCambioDispositivo(this.detectarDispositivo())
      }
      this._dataMenu.SetNombreUsuario(this.token.getUser());
      this._dataMenu.SetMenuLista(this.token.getAuth())
    })
  }


  detectarDispositivo(): boolean {
    var valor: boolean = true;
    if (navigator.userAgent.match(/Android/i))
      valor = false
    if (navigator.userAgent.match(/webOS/i))
      valor = true
    if (navigator.userAgent.match(/iPhone/i))
      valor = false
    return valor
  }

  llenarListas(): void {
    if (this.local.GetStorage("listaProducto")) {
      this.llenarObjetoTabla(this.local.GetStorage("listaProducto") as Array<Inventario>);
    } else {
      this.__servicioPro.listarInventartio()
        .subscribe((data: Array<Inventario>) => {
          this.local.SetStorage("listaProducto", data);
          this.llenarObjetoTabla(data)
        });
    }
  }

  llenarObjetoTabla(productoLista: Array<Inventario>): void {
    let lista = [... new Set(productoLista.map(valor => {
      if (valor.producto.tipo != "mercaderia")
        return valor.producto.tipo
      else
       return null
    }))]
    lista.forEach((valor) => {
      if (valor)
        this.ObjetoTabla.push({
          tipo: valor,
          inventario: productoLista.filter(v => v.producto.tipo === valor).map(inve => { inve.cantidad = 1; return inve })
        })
    })
  }


}
