import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenServiceService } from '../Servicios/token-service.service';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../Servicios/loading.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorTokenService implements HttpInterceptor {

  constructor(
    private token:TokenServiceService,
    private cargando:LoadingService
    ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.cargando.AbrirCargando()
    let intreq = req;
   const token =this.token.getToken()
   if(token != null){
     intreq = req.clone({
      setHeaders:{
        'Authorization':"Bearer "+token,
        "Content-Type": "application/json"
      }
     })
   }else{
    const credenciales=btoa('AngularVentasAsadero'+':'+'Andy$_2003_$')
    intreq = req.clone({
     setHeaders:{
      "Content-Type": "application/x-www-form-urlencoded",
      'Authorization':"Basic "+credenciales
     }
    });
   }
   return next.handle(intreq).pipe(
    finalize(()=> this.cargando.CerrarCargando())
   );
  }
}
