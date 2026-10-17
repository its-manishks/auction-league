import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { readApiError } from '../services/api-error';

const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).+$/;

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html'
})
export class RegistrationComponent {

  username = '';
  password = '';
  confirmPassword = '';
  role = 'ADMIN';

  usernameTouched = false;
  passwordTouched = false;
  confirmPasswordTouched = false;

  showPassword = false;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) { }

  onUsernameBlur(): void {
    this.usernameTouched = true;
  }

  onPasswordBlur(): void {
    this.passwordTouched = true;
  }

  onConfirmPasswordBlur(): void {
    this.confirmPasswordTouched = true;
  }

  /** Live checklist shown under the password field. */
  get passwordRules(): { label: string; ok: boolean }[] {
    const pw = this.password || '';
    return [
      { label: 'One uppercase letter', ok: /[A-Z]/.test(pw) },
      { label: 'One lowercase letter', ok: /[a-z]/.test(pw) },
      { label: 'One number', ok: /\d/.test(pw) },
      { label: 'One special character', ok: /[^\da-zA-Z]/.test(pw) }
    ];
  }

  get usernameError(): string {

    if (this.usernameTouched && !(this.username || '').trim()) {
      return 'Username is required';
    }

    return '';
  }

  get passwordError(): string {

    if (!this.passwordTouched) {
      return '';
    }

    if (!this.password) {
      return 'Password is required';
    }

    if (!PASSWORD_PATTERN.test(this.password)) {
      return 'Password must include at least one uppercase letter, one lowercase letter, one digit, and one special character';
    }

    return '';
  }

  get confirmPasswordError(): string {

    if (!this.confirmPasswordTouched) {
      return '';
    }

    if (!this.confirmPassword) {
      return 'Confirm Password is required';
    }

    if (this.password !== this.confirmPassword) {
      return 'Passwords do not match';
    }

    return '';
  }

  register(): void {

    this.usernameTouched = true;
    this.passwordTouched = true;
    this.confirmPasswordTouched = true;

    this.errorMessage = '';
    this.successMessage = '';

    if (this.usernameError || this.passwordError || this.confirmPasswordError || this.loading) {
      return;
    }

    const username = (this.username || '').trim();
    this.loading = true;

    this.authService.register(username, this.password, this.role).subscribe(
      () => {
        this.loading = false;
        this.successMessage = 'Account created. Sign in to continue.';
        this.toast.success('Account created. Sign in to continue.');
        this.router.navigate(['/login'], { queryParams: { registered: username } });
      },
      (error: HttpErrorResponse) => {
        this.loading = false;
        this.errorMessage = error && error.status === 409
          ? 'That username is already taken. Choose another one.'
          : readApiError(error, 'Registration failed. Try again in a moment.');
      }
    );
  }
}
