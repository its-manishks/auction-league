import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    const routeType = route.url[0] ? route.url[0].path : '';

    if (routeType === 'admin' && !this.authService.isAdmin()) {
      this.router.navigate(['/error'], { queryParams: { code: 403 } });
      return false;
    }

    if (routeType === 'organizer' && !this.authService.isOrganizer()) {
      this.router.navigate(['/error'], { queryParams: { code: 403 } });
      return false;
    }

    return true;
  }
}
