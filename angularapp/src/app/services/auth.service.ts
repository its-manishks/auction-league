import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { API_BASE_URL } from './api.config';

const STORAGE_KEY = 'currentUser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public baseUrl = API_BASE_URL;

  private readonly userSubject = new BehaviorSubject<any>(this.readValidUserOnStartup());

  /** Emits the signed-in user ({ token, username, role }) or null. */
  readonly currentUser$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private zone: NgZone) {
    // Keep several open tabs in sync (logout in one tab logs out the others).
    try {
      window.addEventListener('storage', (event: StorageEvent) => {
        if (event.key === STORAGE_KEY || event.key === null) {
          this.zone.run(() => this.userSubject.next(this.readStoredUser()));
        }
      });
    } catch {
      /* no window (SSR/tests) */
    }
  }

  register(username: string, password: string, role: string): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/user/register`,
      { username, password, role }
    );
  }

  login(username: string, password: string, role: string): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/user/login`,
      { username, password, role }
    ).pipe(
      tap((response: any) => {
        if (response && response.token) {
          this.saveSession(response);
        }
      })
    );
  }

  saveSession(authResponse: any): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authResponse || {}));
    } catch (e) {
      /* storage unavailable */
    }
    this.userSubject.next(authResponse && authResponse.token ? authResponse : null);
  }

  getCurrentUser(): any {
    const user = this.readStoredUser();
    // An expired token is treated as signed out.
    if (user && this.isTokenExpired(user.token)) {
      this.expireSession();
      return null;
    }
    return user;
  }

  getToken(): string | null {
    const user = this.getCurrentUser();
    return user && user.token ? user.token : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return !!user && user.role === 'ADMIN';
  }

  isOrganizer(): boolean {
    const user = this.getCurrentUser();
    return !!user && user.role === 'ORGANIZER';
  }

  /** Route of the dashboard that matches the signed-in role. */
  homeRoute(): string {
    if (this.isAdmin()) {
      return '/admin';
    }
    if (this.isOrganizer()) {
      return '/organizer';
    }
    return '/login';
  }

  logout(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      /* storage unavailable */
    }
    if (this.userSubject.value !== null) {
      this.userSubject.next(null);
    }
  }

  /** Clears an expired session; the emission is deferred so it never lands mid change-detection. */
  private expireSession(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      /* storage unavailable */
    }
    setTimeout(() => {
      if (this.userSubject.value !== null) {
        this.userSubject.next(null);
      }
    });
  }

  private readValidUserOnStartup(): any {
    const user = this.readStoredUser();
    if (user && this.isTokenExpired(user.token)) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        /* storage unavailable */
      }
      return null;
    }
    return user;
  }

  private readStoredUser(): any {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      return parsed && parsed.token ? parsed : null;
    } catch (e) {
      return null;
    }
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = token.split('.')[1];
      if (!payload) {
        return false;
      }
      const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
      return typeof json.exp === 'number' && json.exp * 1000 < Date.now();
    } catch {
      // Not a decodable JWT: let the backend decide.
      return false;
    }
  }
}
