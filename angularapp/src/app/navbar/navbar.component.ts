import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  isLoggedIn = false;
  isAdmin = false;
  isOrganizer = false;
  username = '';
  menuOpen = false;

  private subs = new Subscription();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // React to login/logout instead of re-reading localStorage on every change detection.
    this.subs.add(
      this.authService.currentUser$.subscribe((user) => {
        this.isLoggedIn = !!user;
        this.isAdmin = !!user && user.role === 'ADMIN';
        this.isOrganizer = !!user && user.role === 'ORGANIZER';
        this.username = (user && user.username) || '';
      })
    );

    // Close the mobile menu after navigating.
    this.subs.add(
      this.router.events
        .pipe(filter((e) => e instanceof NavigationEnd))
        .subscribe(() => (this.menuOpen = false))
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  get initials(): string {
    return (this.username || '?').trim().charAt(0).toUpperCase();
  }

  get roleLabel(): string {
    return this.isAdmin ? 'Admin' : this.isOrganizer ? 'Organizer' : '';
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  logout(): void {
    this.authService.logout();
    this.menuOpen = false;
    this.router.navigate(['/login']);
  }
}
