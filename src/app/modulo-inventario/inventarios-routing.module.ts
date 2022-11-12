import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorComponent } from '../modulo-principal/Componentes/error/error.component';
import { IngresarMercaderiaComponent } from './Componentes/ingresar-mercaderia/ingresar-mercaderia.component';
import { PrincipalInventarioComponent } from './Componentes/principal-inventario/principal-inventario.component';

const routes: Routes = [
  { path: '',
  children: [
      {path: 'crear',component: PrincipalInventarioComponent},
      {path: 'actualizar',component: IngresarMercaderiaComponent},
      { path: '404', component: ErrorComponent},
      { path: '', redirectTo: '/crear', pathMatch: 'full' },
      { path: '**', redirectTo: '/404', pathMatch: 'full'}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventariosRoutingModule { }
