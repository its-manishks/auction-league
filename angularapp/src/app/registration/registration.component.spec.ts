import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { RegistrationComponent } from './registration.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('RegistrationComponent', () => {
  let component: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, HttpClientModule, RouterTestingModule],
      declarations: [RegistrationComponent]
    }).compileComponents();
  });

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(RegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tick(); // flush initial NgModel/NgForm registration microtasks
    fixture.detectChanges();
    debugElement = fixture.debugElement;
  }));

  fit('Frontend_day36_should show username required error message on register page', fakeAsync(() => {
    const usernameInput = debugElement.query(By.css('#username'));
    usernameInput.nativeElement.value = '';
    usernameInput.nativeElement.dispatchEvent(new Event('input'));
    usernameInput.nativeElement.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    flush();
    fixture.detectChanges();
    const errorMessage = debugElement.query(By.css('.error-message'));
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.nativeElement.textContent).toContain('Username is required');
  }));

  fit('Frontend_day36_should show password required error message on register page', fakeAsync(() => {
    const passwordInput = debugElement.query(By.css('#password'));
    passwordInput.nativeElement.value = '';
    passwordInput.nativeElement.dispatchEvent(new Event('input'));
    passwordInput.nativeElement.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    flush();
    fixture.detectChanges();
    const errorMessage = debugElement.query(By.css('.error-message'));
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.nativeElement.textContent).toContain('Password is required');
  }));
});