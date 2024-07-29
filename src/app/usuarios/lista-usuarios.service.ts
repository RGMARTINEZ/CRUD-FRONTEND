import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { modeloUsuario, conversionApiModeloUsuario } from './lista-usuarios.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '../shared/UnsubscribeOnDestroyAdapter';


@Injectable({
  providedIn: 'root',
})


export class ListaUsuariosService extends UnsubscribeOnDestroyAdapter {

  private readonly API_URL = 'https://randomuser.me/api/1.4?results=20';
  private readonly API_URL_PAISES = 'https://restcountries.com/v3.1/all?fields=name,capital';
  localStorageKey = 'usuarios';
  loading = true;
  dataChange: BehaviorSubject<modeloUsuario[]> = new BehaviorSubject<modeloUsuario[]>([]);
  dialogData!: modeloUsuario;


  constructor(private httpClient: HttpClient) {
    super();
  }


  get data(): modeloUsuario[] { return this.dataChange.value }


  public getDialogData() { return this.dialogData }


  /** METEDOS CRUD */

  public obtenerDatosApi(): void {
    this.loading = true;
    this.subs.sink = this.httpClient.get<any>(this.API_URL).subscribe(
      (response) => {
        this.loading = false;
        const dataUser = response.results;
        const usuariosConvertidos = conversionApiModeloUsuario(dataUser);
        this.dataChange.next(usuariosConvertidos);
        this.guardarLocalStorage(usuariosConvertidos);
      },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
        this.loadInitialData(); 
      }
    );
  }


  public loadInitialData(): void {
    const storedData = localStorage.getItem(this.localStorageKey);
    if (storedData) {
      this.dataChange.next(JSON.parse(storedData));
    }
    this.loading = false;
  }


  public guardarLocalStorage(data: modeloUsuario[]): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(data));
    this.dataChange.next(data);
  }


  public agregarUsuario(data: modeloUsuario): void {
    const currentData = this.dataChange.value;
    currentData.push(data);
    this.guardarLocalStorage(currentData);
    this.dialogData = data;
  }


  public updateAdvanceTable(data: modeloUsuario): void {
    const currentData = this.dataChange.value;
    const index = currentData.findIndex((item) => item.id === data.id);
    if (index !== -1) {
      currentData[index] = data;
      this.guardarLocalStorage(currentData);
      this.dialogData = data;
    }
  }


  public eliminarUsuario(id: string): void {
    const currentData = this.dataChange.value;
    const updatedData = currentData.filter((item) => item.id.toString() !== id);
    this.guardarLocalStorage(updatedData);
  }

  public getCountries() {
    return this.httpClient.get<any>(this.API_URL_PAISES);
  }
}
