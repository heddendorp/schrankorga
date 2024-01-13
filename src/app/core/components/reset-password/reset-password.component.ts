import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    RouterLink,
    MatSnackBarModule,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  private supabase = inject(SupabaseService);
  private snackBar = inject(MatSnackBar);
  protected resetForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
  });

  async resetPassword() {
    const value = this.resetForm.value;
    this.resetForm.disable();
    if (value.email) {
      const { error } = await this.supabase.resetPassword(value.email);
      if (error) {
        this.snackBar.open(error.message);
        this.resetForm.enable();
      } else {
        this.snackBar.open('Email sent');
      }
    }
  }
}
