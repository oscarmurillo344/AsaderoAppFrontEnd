import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Mensaje } from 'src/app/modulo-principal/Modelos/mensaje';
import { NuevoUsuario } from '../../Modelos/nuevoUsuario';
import { Usuario } from '../../Modelos/Usuario';
import { AuthService } from '../../Servicios/auth.service';
import { DialogoYesNoComponent } from '../dialogo-yes-no/dialogo-yes-no.component';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html'
})
export class UsuarioComponent implements OnInit {

  UsuarioForm!:FormGroup;
  ListaUsuario!:Array<Usuario>;
  displayedColumns=['nombre','usuario','roles','Eliminar'];
  User!:NuevoUsuario;
  hide:boolean=true;
  private unsuscribir = new Subject<void>();

  constructor(private __serviceUser:AuthService,
              private toast:ToastrService,
              public dialog: MatDialog,
              private fb: FormBuilder) { 
    this.crearForm();
    this.listarUser();
  }

  ngOnInit() {
  }
  
  ngOnDestroy(): void {
    this.unsuscribir.next();
    this.unsuscribir.complete();
  }

  crearForm(){
    this.UsuarioForm = this.fb.group({
      nombre: ['',Validators.required],
      apellido: ['',Validators.required],
      usuario: ['',Validators.required],
      email: ['',Validators.email, Validators.required],
      pass: ['',Validators.required],
      tipo: ['',Validators.required]
    });
  }

  listarUser(){
    this.__serviceUser.ListarUsuario().subscribe((data:Usuario[])=> this.ListaUsuario = data )
  }

  CrearUser(){
    if(this.UsuarioForm.valid){
        this.User = {
          nombre: this.UsuarioForm.value.nombre.toLowerCase(),
          apellido: this.minuscula(this.UsuarioForm.value.apellido),
          nombreUsuario: this.minuscula(this.UsuarioForm.value.usuario),
          email: this.minuscula(this.UsuarioForm.value.email),
          password: this.UsuarioForm.value.pass,
          roles: ['user']
        }    
     
       
      this.__serviceUser.nuevoUser(this.User)
      .subscribe((data:Mensaje)=>{
        if(data.mensaje!==undefined){
          this.toast.success(data.mensaje,"Exitoso");
        }else{
          this.toast.success("consulta realizada","Exitoso");
        }
        this.listarUser();
        this.UsuarioForm.reset();
      });
    }
  }
  public minuscula(texto:string):string{
    return texto.toLocaleLowerCase();
   }

  Eliminar(i:number):void{

    let resultado=this.dialog.open(DialogoYesNoComponent,
      {data:{nombre:this.ListaUsuario[i].nombre,titulo:'usuario'}});
        resultado.afterClosed().pipe(takeUntil(this.unsuscribir))
        .subscribe(data=>{
          if(data==='true'){
            var idUsuario:number =this.ListaUsuario[i].id || 0;
            this.__serviceUser.EliminarUser(idUsuario).
            subscribe((data:Mensaje)=>{
              this.toast.success(data.mensaje,"Exitoso");
              this.listarUser();
            });
          }else{
            resultado.close();
          }
        });
  }
}
