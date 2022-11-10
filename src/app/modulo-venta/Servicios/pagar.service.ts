import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Factura } from '../Modelos/factura';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Mensaje } from 'src/app/modulo-principal/Modelos/mensaje';
import { EntreFecha } from 'src/app/modulo-control/Modelos/EntreFecha';
import { VentasDay } from 'src/app/modulo-control/Modelos/VentasDay';


@Injectable({
  providedIn: 'root'
})
export class PagarService {

  pagarURL=environment.UrlDesarrollo+"factura/";

  constructor(private http:HttpClient) { }

  public pagar(newProduct:Factura): Observable<Mensaje>{
    return this.http.post<Mensaje>(this.pagarURL+'facturar',newProduct);
  }

  public listar(numero:number): Observable<Factura>{
    return this.http.get<Factura>(this.pagarURL+'lista/'+numero);
  }

  public eliminar(numero:number): Observable<Mensaje>{
    return this.http.delete<Mensaje>(this.pagarURL+'delete/'+numero)
  }

  public maximoValor(): Observable<number>{
    return this.http.get<number>(this.pagarURL+'numero');
  }

  public TotalDay(usuario:string):Observable<VentasDay[]>{
    return this.http.get<VentasDay[]>(this.pagarURL+'totalDay/'+usuario);
  }

  public TotalFechasUser(Fecha:EntreFecha):Observable<VentasDay[]>{
    return this.http.post<VentasDay[]>(this.pagarURL+'totalfechaUser',Fecha);
  }

  public TotalFechas(Fecha:EntreFecha):Observable<VentasDay[]>{
    return this.http.post<VentasDay[]>(this.pagarURL+'totalfecha',Fecha);
  }

  public TotalUserFechaDia(Fecha:EntreFecha):Observable<VentasDay[]>{
    return this.http.post<VentasDay[]>(this.pagarURL+'totalfechauserdia',Fecha)
  }

  public TotalFechaDia(Fecha:EntreFecha):Observable<VentasDay[]>{
    return this.http.post<VentasDay[]>(this.pagarURL+'totalfechadia',Fecha)
    }

  public TotalFechasComp(Fecha:EntreFecha):Observable<VentasDay[]>{
    return this.http.post<VentasDay[]>(this.pagarURL+'totalfechasComp',Fecha)
    }
}

