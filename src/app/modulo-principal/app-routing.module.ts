import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'auth', 
    loadChildren: () => import('../modulo-usuario/usuario.module').then(m => m.UsuarioModule)
  },
  {
    path: 'venta', 
    loadChildren: () => import('../modulo-venta/ventas.module').then(m => m.VentasModule)
  },
  { path: 'inventario', 
    loadChildren: () => import('../modulo-inventario/inventarios.module').then(m => m.InventariosModule) 
  },
  { path: 'gasto', 
  loadChildren: () => import('../modulo-gasto/gastos.module').then(m => m.GastosModule) 
  },
  { path: 'control', 
    loadChildren: () => import('../modulo-control/control.module').then(m => m.ControlModule) 
  },
  { path: '**', 
    redirectTo: '/auth/login'
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
