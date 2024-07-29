import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { ListaUsuariosService } from '../../lista-usuarios.service';
import { MatButtonModule } from '@angular/material/button';


export interface ModelEliminar {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  celular: string;
}


@Component({
    selector: 'app-eliminar',
    templateUrl: './eliminar.component.html',
    styleUrls: ['./eliminar.component.scss'],
    standalone: true,
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatButtonModule,
        MatDialogClose,
    ],
})


export class EliminarComponent {
  constructor(
    public dialogRef: MatDialogRef<EliminarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModelEliminar,
    public service: ListaUsuariosService
  ) { }


  cerrar(): void {
    this.dialogRef.close();
  }


  confirmar(): void {
    this.service.eliminarUsuario(this.data.id.toString());
  }

  
}
