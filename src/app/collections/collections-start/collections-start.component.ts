import { Component, inject, OnInit, signal } from '@angular/core';
import { SupabaseService } from '../../core/services/supabase.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Data } from '@angular/router';
import { Database } from '../../generated/database.types';
import { JsonPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { CreateCollectionDialogComponent } from '../create-collection-dialog/create-collection-dialog.component';
import { ImageDownloadComponent } from '../../core/components/image-download/image-download.component';

@Component({
  selector: 'app-collections-start',
  standalone: true,
  imports: [
    MatSnackBarModule,
    JsonPipe,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    ImageDownloadComponent,
  ],
  templateUrl: './collections-start.component.html',
  styleUrl: './collections-start.component.scss',
})
export class CollectionsStartComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private dialog = inject(MatDialog);
  private snackbar = inject(MatSnackBar);
  protected collections = signal<
    Database['public']['Tables']['collections']['Row'][]
  >([]);
  async ngOnInit() {
    const { data, error } = await this.supabase.getCollections();
    if (error) {
      this.snackbar.open(error.message);
    } else {
      this.collections.set(data);
    }
  }

  async createCollection() {
    const data = await firstValueFrom(
      this.dialog.open(CreateCollectionDialogComponent).afterClosed(),
    );
    if (data) {
      const { error } = await this.supabase.createCollection(data);
      if (error) {
        this.snackbar.open(error.message);
      } else {
        void this.ngOnInit();
      }
    }
  }
}
