import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TokenServiceService } from 'src/app/modulo-principal/Servicios/token-service.service';
import { Gastos } from '../../Modelos/gastos';
import { GastosX } from '../../Modelos/gastosX';
import { GastosService } from '../../Servicios/gastos.service';

@Component({
  selector: 'app-gastos',
  templateUrl: './gastos.component.html'
})
export class GastosComponent implements OnInit {

  GastoForm!:FormGroup;
  gasto!:Gastos;
  valorGasto:number=0
  gastox!: GastosX;

  constructor(
    private __GastosService:GastosService,
    private toast:ToastrService,
    private fb:FormBuilder,
    private token:TokenServiceService)
     { 
  }

  ngOnInit() {
    this.crearForm();
  }
  
  crearForm(){
    this.GastoForm = this.fb.group({
      tipo:     ['',Validators.required],
      valor:    ['',Validators.required],
      descripcion: ['',Validators.required],
    });
  }

 

  IngresarGasto(){
    if(this.GastoForm.valid){
      this.gasto =  {
        tipo: this.GastoForm.value.tipo,
        valor: this.GastoForm.value.valor,
        usuario:this.token.getUser(),
        descripcion: this.GastoForm.value.descripcion
      }
      this.__GastosService.Ingresar(this.gasto)
      .subscribe(data=>{
        this.toast.success(data.mensaje,"Exito");
        this.GastoForm.reset();
      });
    }
  }

}
