import { Component, OnInit, Optional } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  code = '404';
  title = 'Page not found';
  message = 'Oops! Something went wrong.';
  primaryLink = '/';
  primaryLabel = 'Go to home';

  constructor(
    @Optional() private route: ActivatedRoute,
    @Optional() private authService: AuthService
  ) { }

  ngOnInit(): void {
    const snapshot = this.route ? this.route.snapshot : null;
    const dataMessage = snapshot && snapshot.data ? snapshot.data['message'] : null;
    const code = snapshot ? snapshot.queryParamMap.get('code') : null;

    if (code === '403') {
      this.code = '403';
      this.title = 'This area is for another role';
      this.message = 'Your account does not have access to that page. Use the dashboard for your role instead.';
    } else {
      this.message = 'The page you are looking for does not exist or has moved. '
        + (dataMessage && dataMessage !== 'Oops! Something went wrong.' ? dataMessage : '');
    }

    if (this.authService && this.authService.isLoggedIn()) {
      this.primaryLink = this.authService.homeRoute();
      this.primaryLabel = 'Go to my dashboard';
    }
  }
}
