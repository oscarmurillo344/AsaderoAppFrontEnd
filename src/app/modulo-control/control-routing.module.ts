import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorComponent } from '../modulo-principal/Componentes/error/error.component';
import { ControlventasComponent } from './Componentes/control-ventas/controlventas.component';

const routes: Routes = [{ path: '', children:[
  {path: 'controlventas', component: ControlventasComponent},
  { path: '404', component: ErrorComponent}, 
  { path: '', redirectTo: '/controlventas', pathMatch: 'full' },
  { path: '**', redirectTo: '/404', pathMatch: 'full'}
] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ControlRoutingModule { }
