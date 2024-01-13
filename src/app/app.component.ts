import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { SupabaseService } from './core/services/supabase.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private router = inject(Router);
  async ngOnInit() {
    const session = await this.supabase.getSession();
    if (session) {
      void this.router.navigate(['/collections']);
    } else {
      void this.router.navigate(['/login']);
    }
  }
}
