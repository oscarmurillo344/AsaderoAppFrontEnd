import { registerLocaleData } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import localeEs from '@angular/common/locales/es';
import { LOCALE_ID, NgModule } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { ControlModule } from '../modulo-control/control.module';
import { GastosModule } from '../modulo-gasto/gastos.module';
import { InventariosModule } from '../modulo-inventario/inventarios.module';
import { MaterialModule } from '../modulo-material/material.module';
import { UsuarioModule } from '../modulo-usuario/usuario.module';
import { VentasModule } from '../modulo-venta/ventas.module';
import { AppRoutingModule } from './app-routing.module';
import { CargandoComponent } from './Componentes/cargando/cargando.component';
import { ErrorComponent } from './Componentes/error/error.component';
import { NavMenuComponent } from './Componentes/nav-menu/nav-menu.component';
import { InterceptorTokenService } from './interceptor/interceptor-token.service';
import { InterceptorResponse } from './interceptor/interceptorResponse.service';
import { DataMenuService } from './Servicios/data-menu.service';
import { LoadingService } from './Servicios/loading.service';
registerLocaleData(localeEs,"es")

@NgModule({
  declarations: [
    NavMenuComponent,
    ErrorComponent,
    CargandoComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    AppRoutingModule,
    MaterialModule,
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut:2000,
      positionClass:'toast-top-center',
      preventDuplicates:false
    }),
    UsuarioModule,
    VentasModule,
    InventariosModule,
    GastosModule,
    ControlModule
  ],
  exports: [
    ErrorComponent
  ],
  providers: [
    DataMenuService,
    LoadingService,
    {
      provide: LOCALE_ID,
      useValue: 'es'
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {appearance: 'outline'},
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorTokenService,
        multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorResponse,
        multi: true
    }
  ],
  bootstrap: [NavMenuComponent]
})
export class AppModule { }
