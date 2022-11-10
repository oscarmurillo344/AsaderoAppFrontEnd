import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }

  SetStorage(key: string,data: any){
     localStorage.setItem(key,JSON.stringify(data));
  }

  GetStorage(key: string):any
  {
    try{
      var json=localStorage.getItem(key)
      return JSON.parse(json?json:"")
    }catch (ex){

    }
  }

  RemoveStorage(key: string){
     localStorage.removeItem(key);
  }

  RemoveAll(){
     localStorage.clear();
  }
}
