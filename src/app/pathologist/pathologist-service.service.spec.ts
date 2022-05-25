import { TestBed } from '@angular/core/testing';

import { PathologistServiceService } from './pathologist-service.service';

describe('PathologistServiceService', () => {
  let service: PathologistServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PathologistServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
