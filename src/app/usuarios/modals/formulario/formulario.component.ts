import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { ListaUsuariosService } from '../../lista-usuarios.service';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { modeloUsuario } from '../../lista-usuarios.model';
import { MatOptionModule } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';


export interface modelData {
  id: number;
  accion: string;
  datosUsuarioSeleccionado: modeloUsuario;
}


@Component({
    selector: 'app-formulario',
    templateUrl: './formulario.component.html',
    styleUrls: ['./formulario.component.scss'],
    standalone: true,
    imports: [
        MatButtonModule,
        MatIconModule,
        MatDialogContent,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatRadioModule,
        MatDatepickerModule,
        MatSelectModule,
        MatOptionModule,
        MatDialogClose,
    ],
})


export class FormularioComponent implements OnInit{
  accionObtenida: string;
  titulo: string;
  formularioForm: UntypedFormGroup;
  datosUsuarioFormulario: modeloUsuario;
  listaPaises: any = [];
  formControl = new UntypedFormControl('', [Validators.required  ]);


  constructor(
    public dialogRef: MatDialogRef<FormularioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: modelData,
    public service: ListaUsuariosService,
    private fb: UntypedFormBuilder
  ) {
    this.accionObtenida = data.accion;

    if (this.accionObtenida === 'editar') {

      this.titulo = data.datosUsuarioSeleccionado.nombre + ' ' + data.datosUsuarioSeleccionado.apellido;
      this.datosUsuarioFormulario = data.datosUsuarioSeleccionado;

    } else {

      this.titulo = '  Nuevo Usuario';
      const blankObject = {} as modeloUsuario;
      this.datosUsuarioFormulario = new modeloUsuario(blankObject);

    }

    this.formularioForm = this.crearFormulario();
  }



  ngOnInit() {
    this.consultarPaises();
  }


  public crearFormulario(): UntypedFormGroup {
    return this.fb.group({
      id: [ this.datosUsuarioFormulario.id ],
      avatar: [this.datosUsuarioFormulario.avatar ],
      nombre: [this.datosUsuarioFormulario.nombre, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      apellido: [this.datosUsuarioFormulario.apellido, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      correo: [ this.datosUsuarioFormulario.correo, [Validators.required, Validators.email, Validators.minLength(5)] ],
      genero: [this.datosUsuarioFormulario.genero, [Validators.required] ],
      nacimiento: [ formatDate(this.datosUsuarioFormulario.nacimiento, 'yyyy-MM-dd', 'en'), [Validators.required] ],
      direccion: [this.datosUsuarioFormulario.direccion, [Validators.required] ],
      celular: [this.datosUsuarioFormulario.celular, [Validators.required, Validators.minLength(2), Validators.maxLength(15)]],
      pais: [this.datosUsuarioFormulario.pais, [Validators.required] ],
    });
  }


  public submit() {}


  public consultarPaises(){
    this.service.getCountries().subscribe((data) => { this.listaPaises = data });
  }

  
  public cerrar(): void {
    this.dialogRef.close();
  }


  public confirmar(): void {
    this.service.agregarUsuario( this.formularioForm.getRawValue() );
  }


}
