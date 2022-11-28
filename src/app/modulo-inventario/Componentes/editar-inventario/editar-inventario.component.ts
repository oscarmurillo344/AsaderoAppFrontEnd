import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DataMenuService } from 'src/app/modulo-principal/Servicios/data-menu.service';
import { DialogoYesNoComponent } from 'src/app/modulo-usuario/Componentes/dialogo-yes-no/dialogo-yes-no.component';
import { Inventario } from '../../Modelos/inventario';
import { InventarioService } from '../../Servicios/inventario.service';

@Component({
  selector: 'app-editar-inventario',
  templateUrl: './editar-inventario.component.html',
  styleUrls: ['./editar-inventario.component.css']
})

export class EditarInventarioComponent implements OnInit, OnDestroy {

  ListaInventarioTabla!: MatTableDataSource<Inventario>;
  displayedColumns: string[] = ['Nombre', 'CantidadE', 'CantidadT', 'Editar', 'Eliminar'];
  private unsuscribir = new Subject<void>();
  @Output() PestanaEvent = new EventEmitter<Inventario>();
  @Input() ListaInventario: Array<Inventario> = []
  @Output() ListaInventarioEvent = new EventEmitter<boolean>();

  constructor(
    private __inventarioService: InventarioService,
    private _serviceData: DataMenuService,
    private mensaje: ToastrService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.ListaInventarioTabla = new MatTableDataSource(this.ListaInventario)
  }

  ngOnDestroy(): void {
    this.unsuscribir.next();
    this.unsuscribir.complete();
  }


  public Editar(inventario: Inventario): void {
    this.PestanaEvent.emit(inventario)
  }

  public Eliminar(inventario: Inventario): void {
    let resultado = this.dialog.open(DialogoYesNoComponent,
      { data: { nombre: inventario.producto?.nombre, titulo: 'producto' } });
    resultado.afterClosed().
      pipe(takeUntil(this.unsuscribir))
      .subscribe((result: String) => {
        if (result == 'true') {
          var idProducto = inventario.id!;
          this.__inventarioService.EliminarInventario(idProducto).
            pipe(takeUntil(this.unsuscribir))
            .subscribe({
              next: data => {
                this.mensaje.success(data.mensaje, "Exitoso");
                this.ListaInventarioEvent.emit(false)
              },
              complete: () => this._serviceData.AccionListaInventario.emit(false)
            })
        } else {
          resultado.close();
        }
      });

  }
}
