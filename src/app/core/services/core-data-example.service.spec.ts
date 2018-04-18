import { TestBed, inject } from '@angular/core/testing';

import { CoreDataExampleService } from './core-data-example.service';

describe('DataExampleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoreDataExampleService]
    });
  });

  it('should be created', inject([CoreDataExampleService], (service: CoreDataExampleService) => {
    expect(service).toBeTruthy();
  }));
});
