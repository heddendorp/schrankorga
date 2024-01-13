import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    RouterLink,
    MatSnackBarModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private supabase = inject(SupabaseService);
  private snackBar = inject(MatSnackBar);
  protected loginForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
  });

  async signIn() {
    const value = this.loginForm.value;
    if (value.email) {
      this.loginForm.disable();
      const { error } = await this.supabase.signInWithOtp(value.email);
      if (error) {
        this.loginForm.enable();
        this.snackBar.open(error.message, 'Close', {
          duration: 5000,
        });
      }
      this.snackBar.open('Check your email for the login link!', 'Close', {
        duration: 5000,
      });
    }
  }
}
