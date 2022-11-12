import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Inventario } from '../../Modelos/inventario';
import { MatDialog } from '@angular/material/dialog';
import { DialogoYesNoComponent } from 'src/app/modulo-usuario/Componentes/dialogo-yes-no/dialogo-yes-no.component';
import { InventarioService } from '../../Servicios/inventario.service';

@Component({
  selector: 'app-principal-inventario',
  templateUrl: './principal-inventario.component.html',
  styleUrls: ['./principal-inventario.component.css']
})
export class PrincipalInventarioComponent implements OnInit {

  PestanaIndex: number = 0
  EditordataInventario!: Inventario

  constructor(private dialogo: MatDialog) { }

  ngOnInit(): void {
  }

  CambioIndexTab(index: number): void {
    this.PestanaIndex = index
  }

  SeleccionTabChange(event: MatTabChangeEvent): void {
    if (this.EditordataInventario?.producto?.nombre?.length > 0 && this.PestanaIndex == 1) {
      this.dialogo.open(DialogoYesNoComponent, {
        data: {
          tipo: "¿Seguro desea salir del formulario?"
        }
      }).afterClosed().subscribe(data => {
        if (data == "false")
          this.PestanaIndex = 0
        else {
          this.EditordataInventario = {
            cantidad: 0, cantidadExiste: 0, cantidadTotal: 0, extras: "", producto: {
              nombre: "", tipo: "", precio: 0, presa: 0
            }
          }
        }
      })
    }
  }

  EditordataInventarioEvent(inventario:Inventario):void {
    this.EditordataInventario = inventario
  }
  EditarInventario(inventario: Inventario): void {
    this.EditordataInventario = inventario
    this.PestanaIndex = 0
  }

}
