import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataMenuService {

  VerMenu = new EventEmitter<boolean>()
  CambioDispositivo = new EventEmitter<boolean>()
  Notificacion = new EventEmitter<number>()
  NombreUsuario = new EventEmitter<string>()
  MenuLista = new EventEmitter<string[]>()
  EstadoVerMenu:boolean = false
  pollo = new EventEmitter<number>()
  presa= new EventEmitter<number>()

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
