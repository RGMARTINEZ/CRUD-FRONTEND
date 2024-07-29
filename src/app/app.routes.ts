import { Route } from '@angular/router';
import { AppComponent } from '../app/app.component';


export const APP_ROUTE: Route[] = [
  {
    path: '',
    component: AppComponent,
    children: [
      { path: '', redirectTo: '/lista-usuarios', pathMatch: 'full' },
      {
        path: 'lista-usuarios',
        loadChildren: () => import('./usuarios/lista-usuarios.routes').then( (m) => m.LISTA_USUARIOS_ROUTE)
      },
    ],
  }
];
