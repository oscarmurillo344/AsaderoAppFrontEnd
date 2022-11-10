import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GastosRoutingModule } from './gastos-routing.module';
import { GastosComponent } from './Componentes/CrearGasto/gastos.component';
import { GastosService } from './Servicios/gastos.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../modulo-material/material.module';


@NgModule({
  declarations: [GastosComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GastosRoutingModule,
    MaterialModule
  ],
  providers: [
    GastosService
  ],
  exports: [
    GastosComponent
  ]
})
export class GastosModule { }
