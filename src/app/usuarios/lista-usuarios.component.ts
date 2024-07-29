import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ListaUsuariosService } from './lista-usuarios.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { modeloUsuario } from './lista-usuarios.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormularioComponent } from './modals/formulario/formulario.component';
import { EliminarComponent } from './modals/eliminar/eliminar.component';
import { UnsubscribeOnDestroyAdapter } from '../shared/UnsubscribeOnDestroyAdapter';
import { NgClass, DatePipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FeatherIconsComponent } from '../shared/components/feather-icons/feather-icons.component';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
    selector: 'app-lista-usuarios',
    templateUrl: './lista-usuarios.component.html',
    styleUrls: ['./lista-usuarios.component.scss'],
    standalone: true,
    imports: [
        MatTooltipModule,
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        MatSortModule,
        NgClass,
        FeatherIconsComponent,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        DatePipe,
    ],
})
export class ListaUsuariosComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  
  columnasTabla = ['imagen', 'nombre', 'apellido', 'correo', 'genero', 'nacimiento', 'celular', 'direccion', 'pais','acciones'];
  baseDatos?: ListaUsuariosService;
  dataSource!: UsuariosDataSource;
  id?: number;
  advanceTable?: modeloUsuario;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;


  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public servicio: ListaUsuariosService,
    private snackBar: MatSnackBar
  ) {
    super();
  }


  ngOnInit() {
    this.cargarDatos();
  }


  public actualizar() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }

  public recargarDatos() {
    this.cargarDatos();  
  }


  public agregarUsuario() {

    const dialogRef = this.dialog.open(FormularioComponent, {
      data: {
        datosUsuarioSeleccionado: this.advanceTable,
        accion: 'agregar',
      }
    });

    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      
      if (result === 1) {
  
        this.baseDatos?.dataChange.value.unshift( this.servicio.getDialogData() );

        this.actualizar();

        this.mostrarNotificacion(
          'snackbar-success',
          'Se ha agregado el registro exitosamente.!!!',
          'bottom',
          'center'
        );
      }
    });
  }


  public editarUsuario(row: modeloUsuario) {
    this.id = row.id;

    const dialogRef = this.dialog.open(FormularioComponent, {
      data: {
        datosUsuarioSeleccionado: row,
        accion: 'editar',
      },
    });

    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {

      if (result === 1) {

        const foundIndex = this.baseDatos?.dataChange.value.findIndex( (x) => x.id === this.id );

        if (foundIndex != null && this.baseDatos) {

          this.baseDatos.dataChange.value[foundIndex] = this.servicio.getDialogData();

          this.actualizar();

          this.mostrarNotificacion(
            'snackbar-info',
            'Se ha editado el registro exitosamente.!!!',
            'bottom',
            'center'
          );
        }
      }
    });
  }


  public eliminarUsuario(row: modeloUsuario) {
    this.id = row.id;

    const dialogRef = this.dialog.open(EliminarComponent, {
      data: row    
    });

    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {

      if (result === 1) {

        const foundIndex = this.baseDatos?.dataChange.value.findIndex( (x) => x.id === this.id );

        if (foundIndex != null && this.baseDatos) {

          this.baseDatos.dataChange.value.splice(foundIndex, 1);

          this.actualizar();

          this.mostrarNotificacion(
            'snackbar-danger',
            'Se ha eliminado el registro exitosamente.!!!',
            'bottom',
            'center'
          );
        }
      }
    });
  }


  public cargarDatos() {
    this.baseDatos = new ListaUsuariosService(this.httpClient);
    this.dataSource = new UsuariosDataSource( this.baseDatos, this.paginator, this.sort );

    this.subs.sink = fromEvent(this.filter.nativeElement, 'keyup').subscribe(() => {
        if (!this.dataSource) { return }
        this.dataSource.filter = this.filter.nativeElement.value;
      }
    );
  }


  public mostrarNotificacion( colorName: string, text: string, placementFrom: MatSnackBarVerticalPosition, placementAlign: MatSnackBarHorizontalPosition ) {
    this.snackBar.open(text, '', { duration: 2000, verticalPosition: placementFrom, horizontalPosition: placementAlign, panelClass: colorName });
  }


}


export class UsuariosDataSource extends DataSource<modeloUsuario> {

  filterChange = new BehaviorSubject('');
  get filter(): string { return this.filterChange.value }
  set filter(filter: string) { this.filterChange.next(filter) }
  datosFiltrados: modeloUsuario[] = [];
  renderizarDatos: modeloUsuario[] = [];


  constructor(
    public serviceDataSource: ListaUsuariosService,
    public paginator: MatPaginator,
    public _sort: MatSort
  ) {
    super();
    this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
  }


  connect(): Observable<modeloUsuario[]> {
    const displayDataChanges = [ this.serviceDataSource.dataChange, this._sort.sortChange, this.filterChange, this.paginator.page];
    this.serviceDataSource.obtenerDatosApi();

    return merge(...displayDataChanges).pipe(
      map(() => {
        this.datosFiltrados = this.serviceDataSource.data
          .slice()
          .filter((advanceTable: modeloUsuario) => { const searchStr = ( advanceTable.nombre + advanceTable.apellido + advanceTable.correo + advanceTable.celular + advanceTable.genero + advanceTable.nacimiento + advanceTable.direccion + advanceTable.pais).toLowerCase();
            return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
          });

        const sortedData = this.ordenamiento(this.datosFiltrados.slice());
        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;

        this.renderizarDatos = sortedData.splice( startIndex, this.paginator.pageSize);
        return this.renderizarDatos;
      })
    );
  }


  disconnect() {}


  ordenamiento(data: modeloUsuario[]): modeloUsuario[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';
      switch (this._sort.active) {
        case 'id':
          [propertyA, propertyB] = [a.id, b.id];
          break;
        case 'nombre':
          [propertyA, propertyB] = [a.nombre, b.nombre];
          break;
        case 'apellido':
          [propertyA, propertyB] = [a.apellido, b.apellido];
          break;
        case 'correo':
          [propertyA, propertyB] = [a.correo, b.correo];
          break;
        case 'direccion':
          [propertyA, propertyB] = [a.direccion, b.direccion];
          break;
        case 'celular':
          [propertyA, propertyB] = [a.celular, b.celular];
          break;
      }
      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
      return (
        (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1)
      );
    });
  }
}
