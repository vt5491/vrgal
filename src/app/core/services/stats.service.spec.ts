import { TestBed, inject } from '@angular/core/testing';

import { StatsService } from './stats.service';
import { HttpClientModule, HttpClient, HttpHandler } from '@angular/common/http';
import { CoreBaseService } from './core-base.service';

describe('StatsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StatsService, HttpClient, HttpHandler, CoreBaseService]
    });
  });

  it('should be created', inject([StatsService], (service: StatsService) => {
    expect(service).toBeTruthy();
  }));
});
