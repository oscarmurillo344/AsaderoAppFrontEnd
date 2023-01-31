import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Factura } from '../Modelos/factura';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Mensaje } from 'src/app/modulo-principal/Modelos/mensaje';
import { EntreFecha } from 'src/app/modulo-control/Modelos/EntreFecha';
import { VentasDay } from 'src/app/modulo-control/Modelos/VentasDay';

const pagarURL= `${environment.UrlServer}factura/`;

@Injectable({
  providedIn: 'root'
})
export class PagarService {

  private cacheFactura: BehaviorSubject<any> = new BehaviorSubject(null)


  constructor(private http:HttpClient) { }

  public pagar(newProduct:Factura): Observable<Mensaje>{
    
    return this.http.post<Mensaje>(pagarURL+'facturar',newProduct);
  }

  public listar(numero:number): Observable<Factura>{
    return this.http.get<Factura>(pagarURL+'lista/'+numero);
  }

  public eliminar(numero:number): Observable<Mensaje>{
    return this.http.delete<Mensaje>(pagarURL+'eliminar/'+numero)
  }

  public maximoValor(conCache:boolean): Observable<number>{
    if (this.cacheFactura.getValue() !== null && conCache) {
      return new Observable((observer) => {
        observer.next(this.cacheFactura.getValue())
      });
    }
    return this.http.get<number>(pagarURL+'numero').pipe(
      map(data => {
        this.cacheFactura.next(data)
        return this.cacheFactura.getValue()
      })
    );
  }

  public TotalDia():Observable<VentasDay[]>{
    return this.http.get<VentasDay[]>(`${pagarURL}totaldia`);
  }

  public TotalDiaUsuario(usuario:string):Observable<VentasDay[]>{
    return this.http.get<VentasDay[]>(`${pagarURL}totaldia/${usuario}`);
  }

  public TotalFechasUser(Fecha:EntreFecha):Observable<VentasDay[]>{
    return this.http.post<VentasDay[]>(`${pagarURL}totalfechaUser`,Fecha);
  }

  public TotalFechas(Fecha:EntreFecha):Observable<VentasDay[]>{
    return this.http.post<VentasDay[]>(`${pagarURL}totalfecha`,Fecha);
  }

  public TotalUserFechaDia(Fecha:EntreFecha):Observable<VentasDay[]>{
    return this.http.post<VentasDay[]>(`${pagarURL}totalfechauserdia`,Fecha)
  }

  public TotalFechaDia(Fecha:EntreFecha):Observable<VentasDay[]>{
    return this.http.post<VentasDay[]>(`${pagarURL}totalfechadia`,Fecha)
    }

  public TotalFechasComp(Fecha:EntreFecha):Observable<VentasDay[]>{
    return this.http.post<VentasDay[]>(`${pagarURL}totalfechasComp`,Fecha)
    }
}

