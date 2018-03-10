import { TestBed, inject } from '@angular/core/testing';

import { CoreBaseService } from './core-base.service';

xdescribe('BaseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoreBaseService]
    });
  });

  it('should be created', inject([CoreBaseService], (service: CoreBaseService) => {
    expect(service).toBeTruthy();
  }));
});
