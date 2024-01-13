import { Injectable } from '@angular/core';
import {
  AuthSession,
  createClient,
  SupabaseClient,
} from '@supabase/supabase-js';
import { Database } from '../../generated/database.types';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient<Database>;
  _session: AuthSession | null = null;

  constructor() {
    this.supabase = createClient<Database>(
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
  getCollections() {
    return this.supabase.from('collections').select();
  }
  createCollection(
    collection: Database['public']['Tables']['collections']['Row'],
  ) {
    return this.supabase.from('collections').insert(collection);
  }
  uploadCollectionPicture(file: File) {
    const id = crypto.randomUUID();
    return this.supabase.storage
      .from('collection-pictures')
      .upload(`${this._session?.user.id}/${id}`, file, {
        contentType: file.type,
      });
  }

  getCollectionPicture(path: string) {
    return this.supabase.storage.from('collection-pictures').download(path);
  }
}
