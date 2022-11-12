import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventariosRoutingModule } from './inventarios-routing.module';
import { CrearInventarioComponent } from './Componentes/crear-inventario/crear-inventario.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductoListService } from './Servicios/producto-list.service';
import { InventarioService } from './Servicios/inventario.service';
import { EditarInventarioComponent } from './Componentes/editar-inventario/editar-inventario.component';
import { IngresarMercaderiaComponent } from './Componentes/ingresar-mercaderia/ingresar-mercaderia.component';
import { MaterialModule } from '../modulo-material/material.module';
import { PrincipalInventarioComponent } from './Componentes/principal-inventario/principal-inventario.component';


@NgModule({
  declarations: [CrearInventarioComponent, EditarInventarioComponent, IngresarMercaderiaComponent, PrincipalInventarioComponent],
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
