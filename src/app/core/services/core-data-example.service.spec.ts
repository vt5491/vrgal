import { TestBed, inject } from '@angular/core/testing';

import { CoreDataExampleService } from './core-data-example.service';
import { HttpClientModule, HttpClient, HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('DataExampleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoreDataExampleService, HttpClient, HttpHandler]
    });
  });

  it('should be created', inject([CoreDataExampleService], (service: CoreDataExampleService) => {
    expect(service).toBeTruthy();
  }));
});
