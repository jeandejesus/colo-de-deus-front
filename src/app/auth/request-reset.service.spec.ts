import { TestBed } from '@angular/core/testing';

import { RequestResetService } from './request-reset.service';

describe('RequestResetService', () => {
  let service: RequestResetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestResetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
