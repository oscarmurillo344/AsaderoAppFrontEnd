import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
   $cargando = new EventEmitter<boolean>(true)

  constructor() { }

  AbrirCargando(){
    this.$cargando.next(true)
  }
  CerrarCargando(){
    this.$cargando.next(false)
  }
}
