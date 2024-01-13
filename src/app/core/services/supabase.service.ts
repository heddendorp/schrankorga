import { Injectable } from '@angular/core';
import {
  AuthSession,
  createClient,
  SupabaseClient,
} from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;
  _session: AuthSession | null = null;

  constructor() {
    this.supabase = createClient(
      'https://rbuwaxugdkhzdmlkpkkp.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJidXdheHVnZGtoemRtbGtwa2twIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTM3MzgwODAsImV4cCI6MjAwOTMxNDA4MH0.n12_eGzQYpJDOhuTDBALsPbtp2VwaWcdkQJ6DMnUQXo',
    );
    this.supabase.auth.onAuthStateChange((event, session) => {
      this._session = session;
    });
  }

  getSession() {
    return this.supabase.auth.getSession();
  }

  signIn(email: string, password: string) {
    return this.supabase.auth.signInWithPassword({ email, password });
  }

  signInWithOtp(email: string) {
    return this.supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${location.protocol}://${location.host}/collections`,
      },
    });
  }

  signOut() {
    return this.supabase.auth.signOut();
  }

  resetPassword(email: string) {
    return this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: location.href,
    });
  }
}
