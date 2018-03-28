import { TestBed, inject } from '@angular/core/testing';

import { LiftReqsService } from './lift-reqs.service';

xdescribe('LiftReqsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LiftReqsService]
    });
  });

  it('should be created', inject([LiftReqsService], (service: LiftReqsService) => {
    expect(service).toBeTruthy();
  }));
});
