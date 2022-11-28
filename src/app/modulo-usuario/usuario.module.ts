import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UsuarioRoutingModule } from './usuario-routing.module';
import { UsuarioComponent } from './Componentes/CrearUsuario/usuario.component';
import { LoginComponent } from './Componentes/login/login.component';
import { DialogoYesNoComponent } from './Componentes/dialogo-yes-no/dialogo-yes-no.component';
import { MaterialModule } from '../modulo-material/material.module';




@NgModule({
  declarations: [UsuarioComponent, LoginComponent,DialogoYesNoComponent],
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
