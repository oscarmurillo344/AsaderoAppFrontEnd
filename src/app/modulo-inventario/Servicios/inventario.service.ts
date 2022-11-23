import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Inventario } from '../Modelos/inventario';
import { updatePollo } from '../Modelos/updatePollo';
import { environment } from 'src/environments/environment.prod';
import { Mensaje } from 'src/app/modulo-principal/Modelos/mensaje';

const UrlInventario = environment.UrlDesarrollo + "inventario/";

@Injectable({
  providedIn: 'root'
})

export class InventarioService {

  private cacheInventario: BehaviorSubject<any> = new BehaviorSubject(null)
  private cacheMercaderia: BehaviorSubject<any> = new BehaviorSubject(null)

  constructor(private http: HttpClient) { }

  public ingresarInventario(inven: Inventario): Observable<Mensaje> {
    return this.http.post<Mensaje>(`${UrlInventario}ingresar`, inven);
  }

  public editarInventario(inven: Inventario): Observable<Mensaje> {
    return this.http.post<Mensaje>(`${UrlInventario}actualizar`, inven);
  }

  public listarInventartio(ConCache:boolean): Observable<Inventario[]> {
      if (this.cacheInventario.getValue() !== null && ConCache) {
        return new Observable((observer) => {
          observer.next(this.cacheInventario.getValue())
        });
      }
    return this.http.get<Inventario[]>(`${UrlInventario}listar`).pipe(
      map(data => {
        this.cacheInventario.next(data)
        return this.cacheInventario.getValue()
      })
    );
  }

  public EliminarInventario(id: number): Observable<Mensaje> {
    return this.http.delete<Mensaje>(`${UrlInventario}eliminar/${id}`);
  }

  public MercaderiaActualizar(id:number, inven: updatePollo): Observable<Mensaje> {
    return this.http.put<Mensaje>(`${UrlInventario}mercaderia/actualizar/${id}`, inven);
  }

  public IngresarPolloView(inven: updatePollo): Observable<Mensaje> {
    return this.http.put<Mensaje>(`${UrlInventario}pollo/`, inven);
  }

  public listarpollo(ConCache: boolean): Observable<updatePollo> {
    if (this.cacheMercaderia.getValue() !== null && ConCache) {
      return new Observable((observer) => {
        observer.next(this.cacheMercaderia.getValue())
      });
    }
    return this.http.get<updatePollo>(`${UrlInventario}pollo/lista`).pipe(
      map(data => {
        this.cacheMercaderia.next(data)
        return this.cacheMercaderia.getValue()
      })
    );
  }
}
