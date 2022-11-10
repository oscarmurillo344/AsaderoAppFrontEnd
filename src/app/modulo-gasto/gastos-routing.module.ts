import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorComponent } from '../modulo-principal/Componentes/error/error.component';
import { GastosComponent } from './Componentes/CrearGasto/gastos.component';

const routes: Routes = [
  { path: '',children: [
      {path: 'ingresar' , component: GastosComponent},
      { path: '404', component: ErrorComponent}, 
      { path: '', redirectTo: '/ingresar', pathMatch: 'full' },
      { path: '**', redirectTo: '/404', pathMatch: 'full'}
  ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GastosRoutingModule { }
