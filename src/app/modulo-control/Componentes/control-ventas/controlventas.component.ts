import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Gastos } from 'src/app/modulo-gasto/Modelos/gastos';
import { GastosX } from 'src/app/modulo-gasto/Modelos/gastosX';
import { GastosService } from 'src/app/modulo-gasto/Servicios/gastos.service';
import { EntreFecha } from 'src/app/modulo-control/Modelos/EntreFecha';
import { VentasDay } from '../../Modelos/VentasDay';
import { ExportarComponent } from '../exportar/exportar.componentes';
import { AuthService } from 'src/app/modulo-usuario/Servicios/auth.service';
import { PagarService } from 'src/app/modulo-venta/Servicios/pagar.service';
import { Usuario } from 'src/app/modulo-usuario/Modelos/Usuario';

@Component({
  selector: 'app-controlventas',
  templateUrl: './controlventas.component.html',
  styleUrls: ['./controlventas.component.css']
})
export class ControlventasComponent implements OnInit {

  @ViewChild(MatPaginator, { static: false }) paginatorVentas!: MatPaginator;
  VentasColumns: string[] = ['No', 'Producto', 'Cantidad', 'Precio']
  DataVentas!: MatTableDataSource<VentasDay>;
  valor: number = 0;
  vista_dia: boolean = false
  vista_fecha: boolean = false
  ListaUser: Observable<Usuario[]>
  fechas!: EntreFecha;
  UserForm: FormGroup;
  cerrado!: boolean;
  gastosX!: GastosX;
  valorGasto: number = 0;
  private unsuscribir = new Subject<void>()
  semana: string[];
  diaSeleccion: string[] = [];

  constructor(
    private usuario: AuthService,
    private __factura: PagarService,
    private __gastos: GastosService,
    private toast: ToastrService,
    public dialogo: MatDialog
  ) {
    this.UserForm = this.crearFormMain()
    this.ListaUser = this.usuario.ListarUsuario()
    this.semana = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sábado', 'domingo'];
  }

  crearFormMain() {
    return new FormGroup({
      Seleccion: new FormControl('', Validators.required),
      usuario: new FormControl('', Validators.required),
      start: new FormControl(new Date(), Validators.required),
      end: new FormControl(new Date(), Validators.required)
    });
  }


  select(event: string) {
    switch (event) {
      case 'semanas':
        this.vista_fecha = true
        this.vista_dia = false
        break;
      case 'semanas-dia':
        this.vista_dia = true
        break;
      default:
        this.vista_fecha = false
        this.vista_dia = false
        break;
    }
  }
  ngOnInit() {

  }

  ngOnDestroy(): void {
    this.unsuscribir.next();
    this.unsuscribir.complete();
  }

  public SeleccionCheck(event: any): void {
    if (event.checked) {
      this.diaSeleccion.push(event.source.value)
    } else {
      this.diaSeleccion = this.diaSeleccion.filter(d => d != event)
    }
  }

  getTotalCostVentas(): void {
    this.valor = 0;
    this.DataVentas.data.forEach(ele => this.valor = this.valor + (ele.cantidad * ele.precio))
  }

  inicializarPaginatorVentas(): void {
    setTimeout(() => this.DataVentas.paginator = this.paginatorVentas);
  }

  ExportarExcel(): void {
    if (this.DataVentas !== undefined) {
      let array: any[] = this.DataVentas.data
      array.forEach(element => element.precio = element.cantidad * element.precio)
      let respuesta = this.dialogo.open(ExportarComponent,
        { data: { datos: array, fechaInicio: this.UserForm.value.start, fechaFinal: this.UserForm.value.end } })
      respuesta.afterClosed().
        pipe(takeUntil(this.unsuscribir)).
        subscribe(data => respuesta.close());
    } else {
      this.toast.warning("No existen datos", "Advertencia");
    }
  }

  ListarVentas(): void {
    if (this.UserForm.valid) {
      this.cerrado = false;
      this.fechas = new EntreFecha(this.UserForm.value.usuario,
        this.UserForm.value.start, this.UserForm.value.end, this.diaSeleccion.toString())

      if (this.UserForm.value.Seleccion === 'hoy' && this.UserForm.value.usuario === 'todos') {
        this.__factura.TotalDia().
          pipe(takeUntil(this.unsuscribir)).
          subscribe((data: VentasDay[]) => {
            this.DataVentas = new MatTableDataSource(data);
            this.inicializarPaginatorVentas();
            this.toast.success("Consulta Exitosa", "Exito");
            this.getTotalCostVentas();
          })
      }

      if (this.UserForm.value.Seleccion === 'hoy' && this.UserForm.value.usuario !== 'todos') {
        let usuario = this.UserForm.value.usuario
        this.__factura.TotalDiaUsuario(usuario).
          pipe(takeUntil(this.unsuscribir)).
          subscribe((data: VentasDay[]) => {
            this.DataVentas = new MatTableDataSource(data);
            this.inicializarPaginatorVentas();
            this.toast.success("Consulta Exitosa", "Exito");
            this.getTotalCostVentas();
          })
      }

      if (this.UserForm.value.Seleccion === 'semanas' && this.UserForm.value.usuario !== 'todos') {
          this.__factura.TotalFechasUser(this.fechas).
          subscribe((data: VentasDay[]) => {
            this.DataVentas = new MatTableDataSource(data);
            this.inicializarPaginatorVentas();
            this.toast.success("Consulta Exitosa", "Exito");
            this.getTotalCostVentas();
          })
      }

      if (this.UserForm.value.Seleccion === 'semanas' && this.UserForm.value.usuario === 'todos') {
        this.__factura.TotalFechas(this.fechas).
        pipe(takeUntil(this.unsuscribir))
        .subscribe((data: VentasDay[]) => {
          this.DataVentas = new MatTableDataSource(data);
          this.inicializarPaginatorVentas();
          this.toast.success("Consulta Exitosa", "Exito");
          this.getTotalCostVentas();
        })
      }

      if (this.UserForm.value.Seleccion == 'semanas-dia' && this.UserForm.value.usuario !== 'todos') {
        this.__factura.TotalUserFechaDia(this.fechas)
        .subscribe((data: VentasDay[]) => {
          this.DataVentas = new MatTableDataSource(data);
          this.inicializarPaginatorVentas();
          this.toast.success("Consulta Exitosa", "Exito");
          this.getTotalCostVentas();
        })
      }

      if (this.UserForm.value.Seleccion == 'semanas-dia' && this.UserForm.value.usuario == 'todos') {
        this.__factura.TotalFechaDia(this.fechas)
        .subscribe((data: VentasDay[]) => {
          this.DataVentas = new MatTableDataSource(data);
          this.inicializarPaginatorVentas();
          this.toast.success("Consulta Exitosa", "Exito");
          this.getTotalCostVentas();
        })
      }

      this.ListarGastos();
    } 
}


ListarGastos(): void {
  this.gastosX = new GastosX(this.UserForm.value.usuario, '', this.UserForm.value.start, this.UserForm.value.end)
    if(this.UserForm.value.usuario === 'todos') {
  this.__gastos.listarFecha(this.gastosX).
    subscribe((gasto: Gastos[]) => {
      this.getTotalGastos(gasto);
    })
} else if (this.UserForm.value.usuario !== 'todos') {
  this.__gastos.listarUserFecha(this.gastosX).
    subscribe((gasto: Gastos[]) => {
      this.getTotalGastos(gasto);
    })
}

  }
getTotalGastos(Dato: Array<any>): void {
  this.valorGasto = 0;
  Dato.forEach(ele => this.valorGasto = this.valorGasto + ele.valor)
}
}
