import { Routes } from '@angular/router';
import { COLLECTION_ROUTES } from './collections/collections.routes';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./core/components/login/login.component').then(
        (m) => m.LoginComponent,
      ),
  },
  {
    path: 'collections',
    children: COLLECTION_ROUTES,
  },
];
