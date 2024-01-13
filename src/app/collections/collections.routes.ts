import { Routes } from '@angular/router';

export const COLLECTION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./collections-start/collections-start.component').then(
        (m) => m.CollectionsStartComponent,
      ),
  },
];
