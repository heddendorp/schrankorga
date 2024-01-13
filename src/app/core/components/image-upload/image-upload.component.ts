import { Component, EventEmitter, inject, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FileChangeEvent } from '@angular/compiler-cli/src/perform_watch';
import { SupabaseService } from '../../services/supabase.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.scss',
})
export class ImageUploadComponent {
  private supabase = inject(SupabaseService);
  private snackbar = inject(MatSnackBar);
  @Output() imageUploaded = new EventEmitter<string>();

  async handleImage(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.snackbar.open('Uploading image...');
      const { data, error } = await this.supabase.uploadCollectionPicture(file);
      if (error) {
        this.snackbar.open(error.message);
      } else {
        this.imageUploaded.emit(data.path);
        this.snackbar.open('Image uploaded!', 'Dismiss', {
          duration: 3000,
        });
      }
    }
  }
}
