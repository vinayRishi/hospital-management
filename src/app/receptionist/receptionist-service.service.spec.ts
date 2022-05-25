import { TestBed } from '@angular/core/testing';

import { ReceptionistServiceService } from './receptionist-service.service';

describe('ReceptionistServiceService', () => {
  let service: ReceptionistServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReceptionistServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
