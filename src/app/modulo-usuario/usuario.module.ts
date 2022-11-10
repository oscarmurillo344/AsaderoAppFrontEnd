import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { UsuarioRoutingModule } from './usuario-routing.module';
import { UsuarioComponent } from './Componentes/CrearUsuario/usuario.component';
import { LoginComponent } from './Componentes/login/login.component';
import { DialogoYesNoComponent } from './Componentes/dialogo-yes-no/dialogo-yes-no.component';
import { FilterArray } from './Pipe/filterArray';
import { MaterialModule } from '../modulo-material/material.module';




@NgModule({
  declarations: [UsuarioComponent, LoginComponent,DialogoYesNoComponent,FilterArray],
  imports: [
    CommonModule,
    UsuarioRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    LoginComponent, UsuarioComponent,DialogoYesNoComponent
  ]
})
export class UsuarioModule { }
