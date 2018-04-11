import { TestBed, inject } from '@angular/core/testing';

import { DataExampleService } from './data-example.service';

describe('DataExampleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataExampleService]
    });
  });

  it('should be created', inject([DataExampleService], (service: DataExampleService) => {
    expect(service).toBeTruthy();
  }));
});
