import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inventario } from '../Modelos/inventario';
import { updatePollo } from '../Modelos/updatePollo';
import { environment } from 'src/environments/environment.prod';
import { Mensaje } from 'src/app/modulo-principal/Modelos/mensaje';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  urlInven=environment.UrlDesarrollo+"inventario/";
  EventoCargarInventario =new EventEmitter<string>();

  constructor(private http:HttpClient) { }

  public ingresarInventario(inven:Inventario):Observable<Mensaje>{
    return this.http.post<Mensaje>(this.urlInven+'ingresar',inven);
  }
  public listarInventartio():Observable<Inventario[]>{
    return this.http.get<Inventario[]>(this.urlInven+'listar');
  }

  public UpdateInventario(inven:Inventario):Observable<Mensaje>{
    return this.http.put<Mensaje>(this.urlInven+'actualizar',inven);
  }

  public EliminarInventario(id:number):Observable<Mensaje>{
 return this.http.delete<Mensaje>(this.urlInven+'eliminar/'+id);
  }

  public TablePollo(inven:updatePollo):Observable<Mensaje>{
    return this.http.put<Mensaje>(this.urlInven+'pollo/',inven);
  }

  public listarpollo():Observable<updatePollo>{
    return this.http.get<updatePollo>(this.urlInven+'pollo/lista');
  }
}
