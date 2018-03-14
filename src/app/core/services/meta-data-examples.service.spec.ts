import { TestBed, inject } from '@angular/core/testing';

import { MetaDataExamplesService } from './meta-data-examples.service';

describe('MetaDataExamplesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MetaDataExamplesService]
    });
  });

  it('should be created', inject([MetaDataExamplesService], (service: MetaDataExamplesService) => {
    expect(service).toBeTruthy();
  }));
});
