import { TestBed } from '@angular/core/testing';

import { RediologistServiceService } from './rediologist-service.service';

describe('RediologistServiceService', () => {
  let service: RediologistServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RediologistServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
