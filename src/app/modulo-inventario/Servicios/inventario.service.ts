import { EventEmitter, Injectable } from '@angular/core';
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
  AccionListaInventario = new EventEmitter<boolean>()

  constructor(private http: HttpClient) { }

  public ingresarInventario(inven: Inventario): Observable<Mensaje> {
    return this.http.post<Mensaje>(UrlInventario + 'ingresar', inven);
  }

  public listarInventartio(ConCache:boolean = true): Observable<Inventario[]> {
      if (this.cacheInventario.getValue() !== null && ConCache) {
        return new Observable((observer) => {
          observer.next(this.cacheInventario.getValue())
        });
      }
    return this.http.get<Inventario[]>(UrlInventario + 'listar').pipe(
      map(data => {
        this.cacheInventario.next(data)
        return this.cacheInventario.getValue()
      })
    );
  }

  public UpdateInventario(inven: Inventario): Observable<Mensaje> {
    return this.http.put<Mensaje>(UrlInventario + 'actualizar', inven);
  }

  public EliminarInventario(id: number): Observable<Mensaje> {
    return this.http.delete<Mensaje>(UrlInventario + 'eliminar/' + id);
  }

  public TablePollo(inven: updatePollo): Observable<Mensaje> {
    return this.http.put<Mensaje>(UrlInventario + 'pollo/', inven);
  }

  public listarpollo(ConCache: boolean = true): Observable<updatePollo> {
    if (this.cacheMercaderia.getValue() !== null && ConCache) {
      return new Observable((observer) => {
        observer.next(this.cacheMercaderia.getValue())
      });
    }
    return this.http.get<updatePollo>(UrlInventario + 'pollo/lista').pipe(
      map(data => {
        this.cacheMercaderia.next(data)
        return this.cacheMercaderia.getValue()
      })
    );
  }
}
