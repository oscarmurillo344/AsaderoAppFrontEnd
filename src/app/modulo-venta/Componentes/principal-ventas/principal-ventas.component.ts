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
    private __servicioInventario: InventarioService,
    private token: TokenServiceService,
    private _serviceData: DataMenuService,
    private local: LocalstorageService,
  ) {
  }

  ngOnDestroy(): void {
    clearTimeout(this.TiempoFuera)
  }

  ngOnInit() {
    this._serviceData.AccionListaInventario.subscribe((data) => this.llenarListas(data))
    this._serviceData.AccionListaPollo.subscribe((data) => this.listarPollos(data))
    this.llenarListas(true)
    this.listarPollos(true)
    if (this.local.GetStorage('DataCarrito')) this.carrito = this.local.GetStorage('DataCarrito');
    this.InicializarMenuAndUser()
  }

  InicializarMenuAndUser(): void {
    this.TiempoFuera = setTimeout(() => {
      if (this.token.getToken() && !this.token.TokenExpirado()) {
        this._serviceData.AbrirMenu()
        this._serviceData.SetCambioDispositivo(this.detectarDispositivo())
      }
      this._serviceData.SetNombreUsuario(this.token.getUser());
      this._serviceData.SetMenuLista(this.token.getAuth())
    })
  }

  listarPollos(conCache: boolean): void {
    this.__servicioInventario.listarpollo(conCache)
      .subscribe((data: updatePollo) => {
        this._serviceData.SetPollo(data.pollo);
        this._serviceData.SetPresa(data.presa)
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

  llenarListas(cache: boolean): void {
    this.__servicioInventario.listarInventartio(cache)
      .subscribe((data: Array<Inventario>) => {
        this.llenarObjetoTabla(data)
      });
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
