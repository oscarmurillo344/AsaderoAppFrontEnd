import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LocalstorageService } from 'src/app/modulo-principal/Servicios/localstorage.service';
import { DialogoYesNoComponent } from 'src/app/modulo-usuario/Componentes/dialogo-yes-no/dialogo-yes-no.component';
import { Inventario } from '../../Modelos/inventario';
import { InventarioService } from '../../Servicios/inventario.service';
import { DialogoUpdateComponent } from '../dialogo-update/dialogo-update.component';

@Component({
  selector: 'app-editar-inventario',
  templateUrl: './editar-inventario.component.html',
  styleUrls: ['./editar-inventario.component.css']
})
export class EditarInventarioComponent implements OnInit,OnDestroy {

  ListaInventario!:MatTableDataSource<Inventario>;
  displayedColumns: string[] = ['Nombre', 'Cantidad','Editar', 'Eliminar'];
  private unsuscribir = new Subject<void>();

  constructor( private __inventarioService:InventarioService,
               private local:LocalstorageService,
               private mensaje:ToastrService,
               private dialog: MatDialog) { }

  ngOnInit(): void {
    this.__inventarioService.EventoCargarInventario.pipe(takeUntil(this.unsuscribir)
    ).subscribe(evento=>evento=="CargarInventario"?this.cargarCantidad():null)
    this.cargarCantidad();
  }
  ngOnDestroy(): void {
    this.unsuscribir.next();
    this.unsuscribir.complete();
  }
  cargarCantidad(){
            this.__inventarioService.listarInventartio()
              .subscribe((data:Inventario[])=>{
                    this.local.SetStorage("listaProducto",data);
                    this.ListaInventario=new MatTableDataSource(data);
                    this.__inventarioService.EventoCargarInventario.emit("combo")
                  });
   }

   public Editar(index:number):void{
    this.dialog.open(DialogoUpdateComponent,{data:this.ListaInventario.data[index]});
  }

  public Eliminar(index:number):void{
    let resultado=this.dialog.open(DialogoYesNoComponent,
      {data:{nombre:this.ListaInventario.filteredData[index].producto?.nombre,titulo:'producto'}});
   resultado.afterClosed().
   pipe( takeUntil(this.unsuscribir))
   .subscribe((result:any)=>{
    if(result=='true'){
      var idProducto=this.ListaInventario.filteredData[index].id || 0;
        this.__inventarioService.EliminarInventario(idProducto).
        pipe( takeUntil(this.unsuscribir))
        .subscribe(data =>{
        this.mensaje.success(data.mensaje,"Exitoso");
       this.cargarCantidad();
      })
    }else{
      resultado.close();
    }
   });

  }
}
