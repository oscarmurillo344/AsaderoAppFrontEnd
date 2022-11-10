import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControlRoutingModule } from './control-routing.module';
import { ControlventasComponent } from './Componentes/control-ventas/controlventas.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExportarComponent } from './Componentes/exportar/exportar.componentes';
import { ControlGastosComponent } from './Componentes/control-gastos/control-gastos.component';
import { MaterialModule } from '../modulo-material/material.module';


@NgModule({
  declarations: [ControlventasComponent,ExportarComponent, ControlGastosComponent],
  imports: [
    CommonModule,
    ControlRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  exports:[
    ControlventasComponent,
    ExportarComponent
  ]
})
export class ControlModule { }
