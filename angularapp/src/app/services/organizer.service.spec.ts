import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { OrganizerService } from './organizer.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('OrganizerService Test', () => {
  let service: OrganizerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [OrganizerService],
    });
    service = TestBed.inject(OrganizerService);
  });

  fit('Frontend_day35_should create the organizer service', () => {
    expect(service).toBeTruthy();
  });
});