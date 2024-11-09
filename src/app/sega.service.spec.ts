import { TestBed } from '@angular/core/testing';

import { SegaService } from './sega.service';

describe('SegaService', () => {
  let service: SegaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SegaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
