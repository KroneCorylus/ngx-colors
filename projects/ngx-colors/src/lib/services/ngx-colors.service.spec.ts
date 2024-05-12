import { TestBed } from '@angular/core/testing';

import { NgxColorsService } from './ngx-colors.service';

describe('NgxColorsService', () => {
  let service: NgxColorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxColorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
