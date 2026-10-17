import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { AdminService } from './admin.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AdminService Test', () => {
  let service: AdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [AdminService],
    });
    service = TestBed.inject(AdminService);
  });

  fit('Frontend_day35_should create the admin service', () => {
    expect(service).toBeTruthy();
  });
});