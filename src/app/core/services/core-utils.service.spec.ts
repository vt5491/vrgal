import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient, HttpHandler } from '@angular/common/http';

import { CoreUtilsService } from './core-utils.service';
import { CoreBaseService } from './core-base.service';

let http: HttpClient;
let coreBase : CoreBaseService;
let coreUtils : CoreUtilsService;

describe('UtilsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoreUtilsService, CoreBaseService, HttpClient, HttpHandler]
    });

    coreBase = TestBed.get(CoreBaseService);
    coreUtils = TestBed.get(CoreUtilsService);
    http = TestBed.get(HttpClient);
  });

  it('should be created', inject([CoreUtilsService], (service: CoreUtilsService) => {
    expect(service).toBeTruthy();
  }));

  it('gridicize return proper row and col counts',  () => {
    let grid : any;

    // archetypal "easy" case
    grid = coreUtils.gridicize(100, 1.0);
    expect(grid.rows).toEqual(10);
    expect(grid.cols).toEqual(10);

    // basic real-world case
    grid = coreUtils.gridicize(100, 1.2);
    expect(grid.cols).toEqual(12);
    expect(grid.rows).toEqual(9);

    // contrived "try to break it" example.
    grid = coreUtils.gridicize(52, 1.5);
    console.log(`ut: rows=${grid.rows}, cols=${grid.cols}`)
    expect(grid.cols).toEqual(11);
    expect(grid.rows).toEqual(5);
  });
});
