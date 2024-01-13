import {
  Component,
  computed,
  effect,
  inject,
  Input,
  signal,
} from '@angular/core';
import { sign } from 'node:crypto';
import { SupabaseService } from '../../services/supabase.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-image-download',
  standalone: true,
  imports: [MatSnackBarModule],
  templateUrl: './image-download.component.html',
  styleUrl: './image-download.component.scss',
})
export class ImageDownloadComponent {
  private path = signal<string>('');
  @Input()
  set image(path: string) {
    this.path.set(path);
  }
  private supabase = inject(SupabaseService);
  private snackbar = inject(MatSnackBar);
  protected imageSrc = signal<string | null>(null);

  constructor() {
    effect(async () => {
      const { data, error } = await this.supabase.getCollectionPicture(
        this.path(),
      );
      if (error) {
        this.snackbar.open(error.message);
      } else {
        const blobUrl = URL.createObjectURL(data);
        this.imageSrc.set(blobUrl);
      }
    });
  }
}
