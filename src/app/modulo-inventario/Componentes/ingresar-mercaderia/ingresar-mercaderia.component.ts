import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataMenuService } from 'src/app/modulo-principal/Servicios/data-menu.service';
import { Inventario } from '../../Modelos/inventario';
import { updatePollo } from '../../Modelos/updatePollo';
import { InventarioService } from '../../Servicios/inventario.service';

@Component({
  selector: 'app-ingresar-mercaderia',
  templateUrl: './ingresar-mercaderia.component.html'
})
export class IngresarMercaderiaComponent implements OnInit {

  PollosForm!: FormGroup;
  update!: updatePollo;
  ListaMercaderia: Inventario[] = []
  constructor(
    private __serviceinven: InventarioService,
    private toast: ToastrService,
    private _serviceData: DataMenuService,
    private route: Router
  ) {

  }
  ngOnInit() {
    this.PollosForm = this.crearForm();
    this.__serviceinven.listarInventartio(true).subscribe(data => this.ListaMercaderia = data.filter(d => d.producto.tipo == "mercaderia"))
  }
  crearForm() {
    return new FormGroup({
      pollo: new FormControl(0, [Validators.required, Validators.min(0)]),
      presa: new FormControl(0, [Validators.required, Validators.max(8), Validators.min(0)]),
      mercaderia: new FormControl('', [Validators.required]),
      validar: new FormControl(true)
    });
  }

  ActualizarPollo() {
    if (this.PollosForm.valid) {
      let tipoMercaderia: number = this.PollosForm.value.mercaderia
      this.update = {
        pollo: this.PollosForm.value.pollo,
        presa: this.PollosForm.value.presa
      }
      if (this.PollosForm.value.validar) {
        this.__serviceinven.MercaderiaActualizar(tipoMercaderia, this.update).
          subscribe(() => {
            this.__serviceinven.IngresarPolloView(this.update).subscribe({
              next: () => {
                this.toast.success("Pollo actualizado", "Exitoso");
                this.PollosForm.reset();
                this.route.navigate(["ventas/inicio"])
              },
              complete: () => {
                this._serviceData.AccionListaPollo.emit(false)
                this._serviceData.AccionListaInventario.emit(false)
              }
            })
          });
      } else {
        this._serviceData.SetPollo(this.update.pollo)
        this._serviceData.SetPresa(this.update.presa)
      }
    } else {
      this.toast.info("Ingrese datos correctos")
    }
  }

}
