import { AfterContentInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataMenuLista } from '../../Modelos/DataMenuLista';
import MenuLista from '../../Modelos/MenuList';
import { Observable, Subject } from 'rxjs';
import { map, shareReplay, takeUntil } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { DataMenuService } from '../../Servicios/data-menu.service';
import { LocalstorageService } from '../../Servicios/localstorage.service';
import { LoadingService } from '../../Servicios/loading.service';
import { ListaProducto } from 'src/app/modulo-inventario/Modelos/lista-producto';
import { TokenServiceService } from '../../Servicios/token-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit, OnDestroy{

    notificacion:number = 0
    ListaMenu:Array<MenuLista> = DataMenuLista
    DataCarrito!:Array<ListaProducto>;
    cerrarNav: boolean = false
    VerCargar = this.cargando.$cargando
    isHandset$: Observable<boolean> = this.breakpointObserver.observe([
    Breakpoints.Medium,
    Breakpoints.Large,
    Breakpoints.XLarge
  ]).pipe(
      map(result => result.matches),
      shareReplay()
    );
    VerMenu$ = this._DataMenu.VerMenu
    unsubscribe = new Subject<void>()
    TiempoFuera!: NodeJS.Timeout; 

  constructor(
    private breakpointObserver: BreakpointObserver,
    public _DataMenu:DataMenuService,
    private local:LocalstorageService,
    public cargando:LoadingService,
    private token: TokenServiceService
  ) { }
  
  ngOnInit(): void {
    this.isHandset$
      .pipe( takeUntil(this.unsubscribe))
      .subscribe((data: boolean) => {
              if (this._DataMenu.EstadoMenu())
              this.cerrarNav = data
              else this.cerrarNav = false
          })
    this._DataMenu.CambioDispositivo
          .pipe( takeUntil(this.unsubscribe))
              .subscribe((data:boolean)=> this.cerrarNav = data)
    this._DataMenu.MenuLista
          .pipe( takeUntil(this.unsubscribe))
              .subscribe( (data:string[]) => this.ComprobarMenu(data))
    this._DataMenu.Notificacion
          .pipe( takeUntil(this.unsubscribe))
              .subscribe(()=>this.verificarNotificacion())
    this.verificarNotificacion()
    this.Inicializando()
  }

  ngOnDestroy(): void {
    clearTimeout(this.TiempoFuera)
  }

  Inicializando(): void{
    this.TiempoFuera = setTimeout(() => {
      if (this.token.getToken() && !this.token.TokenExpirado()) {
        this._DataMenu.AbrirMenu()
        this._DataMenu.SetCambioDispositivo(this.detectarDispositivo())
      }
      this._DataMenu.SetNombreUsuario(this.token.getUser());
      this._DataMenu.SetMenuLista(this.token.getAuth())
    });
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

  verificarNotificacion(){
    this.notificacion=0;
   if(this.local.GetStorage('DataCarrito') != null){
     this.DataCarrito=this.local.GetStorage('DataCarrito');
     for(var i=0;i<this.DataCarrito.length && this.DataCarrito!=null;i++){
       this.notificacion+=this.DataCarrito[i].cantidad
     }
    }
}
  ComprobarMenu(roles:string []): void{
    this.ListaMenu.forEach( (data2:MenuLista, index:number) => {
      let detener = true
     for (let i=0; i < data2.permisos.length && detener ; i++){
           if(roles.includes(data2.permisos[i])){
            this.ListaMenu[index].default = true
            detener = false
           }else this.ListaMenu[index].default = false
      }
    })
  }

  onActivate($event: Event): void{
  }

  onDeactivate($event: Event): void {
  }

  logOut(): void{
    this.local.RemoveAll()
    this._DataMenu.CerrarMenu()
    this.cerrarNav = false
  }

}
