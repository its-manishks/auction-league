import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  isLoggedIn = false;
  dashboardRoute = '/login';
  dashboardLabel = 'Open dashboard';

  private sub?: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.sub = this.authService.currentUser$.subscribe((user) => {
      this.isLoggedIn = !!user;
      const isOrganizer = !!user && user.role === 'ORGANIZER';
      this.dashboardRoute = !user ? '/login' : isOrganizer ? '/organizer' : '/admin';
      this.dashboardLabel = isOrganizer ? 'Open auction room' : 'Open admin dashboard';
    });
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
