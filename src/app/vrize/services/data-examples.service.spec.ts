import { TestBed, inject } from '@angular/core/testing';

import { DataExamplesService } from './data-examples.service';

xdescribe('DataExamplesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataExamplesService]
    });
  });

  it('should be created', inject([DataExamplesService], (service: DataExamplesService) => {
    expect(service).toBeTruthy();
  }));
});
