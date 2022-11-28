import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { LoginUsuario } from "../Modelos/loginUsuario";
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Mensaje } from 'src/app/modulo-principal/Modelos/mensaje';
import { Usuario } from '../Modelos/Usuario';
import { NuevoUsuario } from '../Modelos/nuevoUsuario';

const authURL: string = environment.UrlDesarrollo+"usuario/";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private cache: BehaviorSubject<any> = new BehaviorSubject(null)


  constructor(private http:HttpClient) { }

  public nuevoUser(newUser:NuevoUsuario): Observable<Mensaje>{
    return this.http.post<any>(`${authURL}ingresar`,newUser)
  }

  public LogIn(login:LoginUsuario): Observable<any>{
   let params = new URLSearchParams();
   params.set("grant_type","password")
   params.set("username",login.username)
   params.set("password",login.password)
    return this.http.post<any>(`${environment.UrlDesarrollo}oauth/token`,params.toString());
  }

  public ListarUsuario():Observable<Usuario[]>{
    if(this.cache.getValue() !== null){
      return new Observable((observer)=>{
          observer.next(this.cache.getValue())
      });
  }
    return this.http.get<Usuario[]>(`${authURL}lista`).pipe(
      map(data => {
        this.cache.next(data)
        return this.cache.getValue()
      })
    );
  }

  public EliminarUser(id:number): Observable<Mensaje>{
    return this.http.delete<Mensaje>(`${authURL}eliminar/${id}`);
  }

  public ListarRoles():Observable<any>{
    return this.http.get(`${authURL}rol/`)
  }
}

