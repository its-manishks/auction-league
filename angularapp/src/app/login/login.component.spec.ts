import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { LoginComponent } from './login.component';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../services/auth.service';
import { of } from 'rxjs';
import { Router } from '@angular/router'; // Import Router
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let debugElement: DebugElement;


  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     imports: [FormsModule, RouterTestingModule], // Use RouterTestingModule
  //     declarations: [LoginComponent],
  //     providers: [AuthService]
  //   }).compileComponents();
  // }));
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientModule, RouterTestingModule],
      declarations: [LoginComponent],
      providers: [AuthService]
    }).compileComponents();
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
    debugElement = fixture.debugElement;

  });

  fit('Frontend_day36_call_login_method_on_login', () => {
    const mockUser = {
      user: {
        username: 'admin',
        password: 'Test@123',
        role: 'ADMIN'
      }
    };
    spyOn(authService as any, 'login').and.returnValue(of(mockUser));
    const router = TestBed.inject(Router); // Inject Router
    spyOn(router, 'navigate'); // Spy on router's navigate method

    component['username'] = 'admin';
    component['password'] = 'Test@123';
    component['role'] = 'ADMIN';
    component['login']();

    expect(authService['login']).toHaveBeenCalledWith('admin', 'Test@123', 'ADMIN');
  });


});
