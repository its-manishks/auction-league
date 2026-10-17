import { Component, OnInit, Optional } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { readApiError } from '../services/api-error';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  username = '';
  password = '';
  role = '';

  usernameTouched = false;
  passwordTouched = false;

  showPassword = false;
  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToastService,
    @Optional() private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Pre-fill the username after a successful registration.
    const snapshot = this.route && this.route.snapshot;
    const registered = snapshot && snapshot.queryParamMap ? snapshot.queryParamMap.get('registered') : null;
    if (registered) {
      this.username = registered;
    }
  }

  onUsernameBlur(): void {
    this.usernameTouched = true;
  }

  onPasswordBlur(): void {
    this.passwordTouched = true;
  }

  get usernameError(): string {
    return this.usernameTouched && !(this.username || '').trim() ? 'Username is required' : '';
  }

  get passwordError(): string {
    return this.passwordTouched && !this.password ? 'Password is required' : '';
  }

  login(): void {

    this.usernameTouched = true;
    this.passwordTouched = true;
    this.errorMessage = '';

    if (this.usernameError || this.passwordError || this.loading) {
      return;
    }

    this.loading = true;

    this.authService.login((this.username || '').trim(), this.password, this.role).subscribe(
      (response: any) => {
        this.loading = false;

        if (!response || !response.token) {
          this.errorMessage = 'Those details do not match an account.';
          return;
        }

        this.toast.success(`Signed in as ${response.username || this.username}.`);

        if (response.role === 'ORGANIZER') {
          this.router.navigate(['/organizer']);
        } else {
          this.router.navigate(['/admin']);
        }
      },
      (error: HttpErrorResponse) => {
        this.loading = false;
        this.errorMessage = error && (error.status === 401 || error.status === 403)
          ? 'Incorrect username or password.'
          : readApiError(error, 'Sign in failed. Try again in a moment.');
      }
    );
  }
}
