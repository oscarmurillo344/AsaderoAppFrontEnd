import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataMenuService {

  @Output() VerMenu = new EventEmitter<boolean>()
  @Output() CambioDispositivo = new EventEmitter<boolean>()
  @Output() Notificacion = new EventEmitter<number>()
  @Output() NombreUsuario = new EventEmitter<string>()
  @Output() MenuLista = new EventEmitter<string[]>()
  @Output() pollo = new EventEmitter<number>()
  @Output() presa = new EventEmitter<number>()
  @Output() AccionListaInventario = new EventEmitter<boolean>()
  @Output() AccionListaPollo = new EventEmitter<boolean>()
  EstadoVerMenu:boolean = false

  constructor() { 
  }

  AbrirMenu(): void {
    this.EstadoVerMenu = true
    this.VerMenu.next(this.EstadoVerMenu)
  }

  CerrarMenu(): void {
    this.EstadoVerMenu = false
    this.VerMenu.next(this.EstadoVerMenu)
  }

  SetNombreUsuario(nombre: string): void{
    this.NombreUsuario.next(nombre)
  }

  SetMenuLista(roles: string[]): void{
    this.MenuLista.next(roles)
  }

  SetCambioDispositivo(valor:boolean): void{
  this.CambioDispositivo.next(valor)
  }

  SetPollo(valor:number): void{
    this.pollo.next(valor)
  }

  SetPresa(valor:number): void{
    this.presa.next(valor)
  }

  EstadoMenu(): boolean {
    return this.EstadoVerMenu
  }
}
