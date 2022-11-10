import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { LoginUsuario } from "../Modelos/loginUsuario";
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Mensaje } from 'src/app/modulo-principal/Modelos/mensaje';
import { Usuario } from '../Modelos/Usuario';
import { NuevoUsuario } from '../Modelos/nuevoUsuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authURL=environment.UrlDesarrollo+"usuario/";

  constructor(private http:HttpClient) { }

  public nuevoUser(newUser:NuevoUsuario): Observable<Mensaje>{
    return this.http.post<any>(this.authURL+'ingresar',newUser);
  }

  public LogIn(login:LoginUsuario): Observable<any>{
   let params = new URLSearchParams();
   params.set("grant_type","password")
   params.set("username",login.username)
   params.set("password",login.password)
    return this.http.post<any>(environment.UrlDesarrollo+'oauth/token',params.toString());
  }

  public ListarUsuario():Observable<Usuario[]>{
    return this.http.get<Usuario[]>(this.authURL+'lista');
  }

  public EliminarUser(id:number): Observable<Mensaje>{
    return this.http.delete<Mensaje>(this.authURL+'eliminar/'+id);
  }
}

