import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Mensaje } from 'src/app/modulo-principal/Modelos/mensaje';
import { environment } from 'src/environments/environment.prod';
import { Gastos } from '../Modelos/gastos';
import { GastosX } from '../Modelos/gastosX';


const URLgasto=environment.UrlDesarrollo+"gastos/";
@Injectable({
  providedIn: 'root'
})
export class GastosService {
  
  constructor(private http:HttpClient) { }
    
  public Ingresar(nuevo:Gastos): Observable<Mensaje>{
    return this.http.post<Mensaje>(URLgasto+'ingresar',nuevo);
  }

  public Eliminar(id:number): Observable<Mensaje>{
    return this.http.delete<Mensaje>(URLgasto+'eliminar/'+id);
  }

  public Listar(): Observable<Gastos[]>{
    return this.http.get<Gastos[]>(URLgasto+'lista');
  }

  public ListarTipoFecha(gasto:GastosX): Observable<Gastos[]>{
    return this.http.post<Gastos[]>(URLgasto+'listaTipo/',gasto);
  }

  public listarTipoUserFecha(gasto:GastosX): Observable<Gastos[]>{
    return this.http.post<Gastos[]>(URLgasto+'listaTipoUserFecha/',gasto);
  }

  public listarUserFecha(gasto:GastosX): Observable<Gastos[]>{
    return this.http.post<Gastos[]>(URLgasto+'listaUserFecha/',gasto);
  }

  public listarFecha(gasto:GastosX): Observable<Gastos[]>{
    return this.http.post<Gastos[]>(URLgasto+'listaFecha/',gasto);
  }

}
