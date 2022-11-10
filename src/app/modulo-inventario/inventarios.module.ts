import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventariosRoutingModule } from './inventarios-routing.module';
import { CrearInventarioComponent } from './Componentes/crear-inventario/crear-inventario.component';
import { DialogoUpdateComponent } from './Componentes/dialogo-update/dialogo-update.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductoListService } from './Servicios/producto-list.service';
import { InventarioService } from './Servicios/inventario.service';
import { EditarInventarioComponent } from './Componentes/editar-inventario/editar-inventario.component';
import { IngresarMercaderiaComponent } from './Componentes/ingresar-mercaderia/ingresar-mercaderia.component';
import { MaterialModule } from '../modulo-material/material.module';


@NgModule({
  declarations: [CrearInventarioComponent,DialogoUpdateComponent, EditarInventarioComponent, IngresarMercaderiaComponent],
  imports: [
    CommonModule,
    InventariosRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule

  ],
  exports: [
    CrearInventarioComponent
  ],
  providers: [
    ProductoListService,
    InventarioService
  ]
})
export class InventariosModule { }
