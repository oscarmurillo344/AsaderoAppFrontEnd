import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Mensaje } from 'src/app/modulo-principal/Modelos/mensaje';
import { environment } from 'src/environments/environment.prod';
import { Gastos } from '../Modelos/gastos';
import { GastosX } from '../Modelos/gastosX';



@Injectable({
  providedIn: 'root'
})
export class GastosService {

  URLgasto=environment.UrlDesarrollo+"gastos/";
  private _listen=new Subject<any>();
  
  constructor(private http:HttpClient) { }

  listen():Observable<any>{
    return this._listen.asObservable();
      }
  
    filter(filterBy:string){
      this._listen.next(filterBy);
    }
    
  public Ingresar(nuevo:Gastos): Observable<Mensaje>{
    return this.http.post<Mensaje>(this.URLgasto+'ingresar',nuevo);
  }

  public Eliminar(id:number): Observable<Mensaje>{
    return this.http.delete<Mensaje>(this.URLgasto+'eliminar/'+id);
  }

  public Listar(): Observable<Gastos[]>{
    return this.http.get<Gastos[]>(this.URLgasto+'lista');
  }

  public ListarTipoFecha(gasto:GastosX): Observable<Gastos[]>{
    return this.http.post<Gastos[]>(this.URLgasto+'listaTipo/',gasto);
  }

  public listarTipoUserFecha(gasto:GastosX): Observable<Gastos[]>{
    return this.http.post<Gastos[]>(this.URLgasto+'listaTipoUserFecha/',gasto);
  }

  public listarUserFecha(gasto:GastosX): Observable<Gastos[]>{
    return this.http.post<Gastos[]>(this.URLgasto+'listaUserFecha/',gasto);
  }

  public listarFecha(gasto:GastosX): Observable<Gastos[]>{
    return this.http.post<Gastos[]>(this.URLgasto+'listaFecha/',gasto);
  }

}
