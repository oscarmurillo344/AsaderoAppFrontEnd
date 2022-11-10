import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, finalize } from 'rxjs/operators';
import { LocalstorageService } from '../Servicios/localstorage.service';
import { ToastrService } from 'ngx-toastr';
import { DataMenuService } from '../Servicios/data-menu.service';
import { LoadingService } from '../Servicios/loading.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorResponse implements HttpInterceptor {

  constructor(private route:Router,
              private local:LocalstorageService,
              private mensaje:ToastrService,
              public __Data:DataMenuService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
   return next.handle(req).pipe(
       catchError((e:any) =>{
            if(e.status == 401){
                this.local.RemoveAll();
                this.route.navigate(["/login"])
                this.__Data.CerrarMenu()
            }
            if(e.status == 403){
                this.mensaje.info("Acceso no permitido","Autorización");
                this.route.navigate(["/inicio"])
            }
            if(e.error?.mensaje)
            this.mensaje.error(e.error.mensaje,"Error")
            else{
              this.mensaje.error("Error en la consulta","Error")
              console.log(e)
            }
            return throwError(e)
       })
   );
  }
}
