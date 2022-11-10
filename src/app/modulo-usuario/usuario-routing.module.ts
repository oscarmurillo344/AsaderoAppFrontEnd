import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorComponent } from '../modulo-principal/Componentes/error/error.component';
import { UsuarioComponent } from './Componentes/CrearUsuario/usuario.component';
import { LoginComponent } from './Componentes/login/login.component';

const routes: Routes = [
  { path: '',
    children:[
      { path: 'login',  component: LoginComponent},
      { path: 'usuarios', component: UsuarioComponent},
      { path: '404', component: ErrorComponent},
      { path: '**', redirectTo: '/login', pathMatch: 'full' }
        ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuarioRoutingModule { }
