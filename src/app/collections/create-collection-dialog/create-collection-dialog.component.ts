import { Component } from '@angular/core';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ImageUploadComponent } from '../../core/components/image-upload/image-upload.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-create-collection-dialog',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogClose,
    ImageUploadComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './create-collection-dialog.component.html',
  styleUrl: './create-collection-dialog.component.scss',
})
export class CreateCollectionDialogComponent {
  protected collectionDialogForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    image: new FormControl(''),
  });

  updateImage(path: string) {
    this.collectionDialogForm.patchValue({ image: path });
  }
}
