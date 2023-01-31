import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Producto } from '../Modelos/producto';
import { Mensaje } from 'src/app/modulo-principal/Modelos/mensaje';

const ProductURL=environment.UrlServer+"producto/";
@Injectable({
  providedIn: 'root'
})
export class ProductoListService {


  constructor(private http:HttpClient) { }

  public nuevoProducto(newProduct:Producto): Observable<Mensaje>{
    return this.http.post<Mensaje>(ProductURL+'ingresar',newProduct);
  }

  public ListaProducto(): Observable<Producto>{
    return this.http.get<Producto>(ProductURL+'lista');
  }

  public EliminarProducto(id:number): Observable<Mensaje>{
    return this.http.delete<Mensaje>(ProductURL+'eliminar/'+id);
  }

  public ActualizarProducto(producto:Producto): Observable<Mensaje>{
    return this.http.put<Mensaje>(ProductURL+'actualizar',producto);
  }
}
