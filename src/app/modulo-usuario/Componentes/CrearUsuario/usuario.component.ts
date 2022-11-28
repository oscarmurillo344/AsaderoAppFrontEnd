import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Mensaje } from 'src/app/modulo-principal/Modelos/mensaje';
import { NuevoUsuario } from '../../Modelos/nuevoUsuario';
import { Usuario } from '../../Modelos/Usuario';
import { AuthService } from '../../Servicios/auth.service';
import { DialogoYesNoComponent } from '../dialogo-yes-no/dialogo-yes-no.component';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html'
})
export class UsuarioComponent implements OnInit {

  @ViewChild('rolInput') rolInput!: ElementRef<HTMLInputElement>;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  UsuarioForm!: FormGroup;
  ListaUsuario!: Array<Usuario>;
  itemsSeleccionado:any[] = []
  ListaRoles:any[] = []
  displayedColumns = ['nombre', 'usuario', 'roles', 'Eliminar'];
  User!: NuevoUsuario;
  hide: boolean = true;
  private unsuscribir = new Subject<void>();

  constructor(private __serviceUser: AuthService,
    private toast: ToastrService,
    public dialog: MatDialog,
    private fb: FormBuilder) {
  }

  ngOnInit() {
    this.crearForm();
    this.listarUser();
    this.listarRoles();
  }

  ngOnDestroy(): void {
    this.unsuscribir.next();
    this.unsuscribir.complete();
  }

  crearForm() {
    this.UsuarioForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      usuario: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      pass: ['', Validators.required],
      roles: ['']
    });
  }

  listarUser() {
    this.__serviceUser.ListarUsuario().subscribe((data: Usuario[]) => this.ListaUsuario = data)
  }
  
  listarRoles(){
    this.__serviceUser.ListarRoles().subscribe((data: any[]) => this.ListaRoles = data)
  }

  resetInputs(): void {
    this.rolInput.nativeElement.value = ''
    this.UsuarioForm.get('roles')!.setValue(null);
  }

  remove(control: any): void {
    this.itemsSeleccionado = this.itemsSeleccionado.filter((data: any) => data.id != control.id)
    this.resetInputs()
  }

  SeleccionControl(event: MatAutocompleteSelectedEvent): void {
    let idRol = event.option.value as number
    let Rol = this.ListaRoles.find((data: any) => data.id == idRol)
    if (!this.itemsSeleccionado.find(data => data.id == idRol)) {
      this.itemsSeleccionado.push({
        id: Rol!.id,
        nombre: Rol!.rolNombre
      })
      this.resetInputs()
    }
  }

  CrearUser() {
    if (this.UsuarioForm.valid) {
      this.User = {
        nombre: this.UsuarioForm.value.nombre.toLowerCase(),
        apellido: this.minuscula(this.UsuarioForm.value.apellido),
        nombreUsuario: this.minuscula(this.UsuarioForm.value.usuario),
        email: this.minuscula(this.UsuarioForm.value.email),
        password: this.UsuarioForm.value.pass,
        roles: this.itemsSeleccionado.map(data => ({ id: data.id, rolNombre: data.nombre}))
      }


      this.__serviceUser.nuevoUser(this.User)
        .subscribe((data: Mensaje) => {
          if (data.mensaje !== undefined) {
            this.toast.success(data.mensaje, "Exitoso");
          } else {
            this.toast.success("consulta realizada", "Exitoso");
          }
          this.listarUser();
          this.UsuarioForm.reset();
        });
    }
  }
  public minuscula(texto: string): string {
    return texto.toLocaleLowerCase();
  }

  Eliminar(usuario: Usuario): void {

    let resultado = this.dialog.open(DialogoYesNoComponent,
      { data: { nombre: usuario.nombre, titulo: 'usuario' } });
    resultado.afterClosed().pipe(takeUntil(this.unsuscribir))
      .subscribe(data => {
        if (data === 'true') {
          this.__serviceUser.EliminarUser(usuario.id).
            subscribe((data: Mensaje) => {
              this.toast.success(data.mensaje, "Exitoso");
              this.listarUser();
            });
        } else {
          resultado.close();
        }
      });
  }
}
