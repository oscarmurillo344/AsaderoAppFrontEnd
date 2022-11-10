import { Injectable } from '@angular/core';
import { LocalstorageService } from './localstorage.service';

const  TOKEN_KEY="AuthToken";
const  USERNAME_KEY="AuthUserName";
const  AUTHORITIES_KEY="AuthAuthorities"

@Injectable({
  providedIn: 'root'
})
export class TokenServiceService {

  roles: Array<string> = [];

  constructor(private local:LocalstorageService) {
   }

  public setToken(token:string): void{
    this.local.RemoveStorage(TOKEN_KEY);
    this.local.SetStorage(TOKEN_KEY,token);
  }

  public getToken(){
    return this.local.GetStorage(TOKEN_KEY);
  }

  public setUser(user:string): void{
    this.local.RemoveStorage(USERNAME_KEY);
    this.local.SetStorage(USERNAME_KEY,user);
  }

  public getUser(){
    return this.local.GetStorage(USERNAME_KEY);
  }

  public setAuth(auth:string[]): void{
    this.local.RemoveStorage(AUTHORITIES_KEY);
    this.local.SetStorage(AUTHORITIES_KEY,auth);
  }

  public getAuth(): string [] {

    this.roles=[];

    if (this.local.GetStorage(AUTHORITIES_KEY)){
      this.local.GetStorage(AUTHORITIES_KEY).forEach((authority:any) => {
        this.roles.push(authority);
      });
    }

    return this.roles;
  }

  public ObtenerData():any{
    return JSON.parse(atob(this.getToken().split('.')[1]))
  }

    TokenExpirado():boolean{
      let payload = this.ObtenerData()
      let hoy = new Date().getTime() / 1000
      if(payload.exp < hoy){
        return true
      }
      return false
    }
  }
