import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AdminComponent } from './admin.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;


  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientModule]
    });

    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
  });

  fit('Frontend_day31_should have teams and players arrays declared', () => {
    expect(component).toBeTruthy();
    expect((component as any).teams).toBeDefined();
    expect((component as any).players).toBeDefined();
  });
});
