import { TestBed } from '@angular/core/testing';

import { ComponentFactoryService } from './component-factory.service';

describe('ComponentFactoryServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ComponentFactoryService = TestBed.get(ComponentFactoryService);
    expect(service).toBeTruthy();
  });
});
