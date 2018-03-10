import { TestBed, inject } from '@angular/core/testing';

import { CoreUtilsService } from './core-utils.service';

xdescribe('UtilsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoreUtilsService]
    });
  });

  it('should be created', inject([CoreUtilsService], (service: CoreUtilsService) => {
    expect(service).toBeTruthy();
  }));
});
