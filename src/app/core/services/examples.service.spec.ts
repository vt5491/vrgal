import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient, HttpHandler } from '@angular/common/http';

import { ExamplesService } from './examples.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ExamplesService', () => {
  let httpMock: HttpTestingController;
  let service: ExamplesService;
  // beforeAll(() => {
  //
  // });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [ExamplesService, HttpClient]
    });

    httpMock = TestBed.get(HttpTestingController);

    service = TestBed.get(ExamplesService);
  });

  it('should be created', inject([ExamplesService], (service: ExamplesService) => {
    expect(service).toBeTruthy();
  }));

  // I simply cannot figure out httpClient mocking at all.
  // it('getExampleIds works', (done) => {
  //   let files = ['webgl_geometry_cube.html', 'webgl_mirror.html'];
  //
  //   service.getExampleIds(files)
  //   .subscribe(rsp => {
  //     console.log(`ut:getExampleIds: rsp=${rsp}`);
  //     done();
  //   });
  //
  //   // let basicReq = httpMock.expectOne('./examples.json');
  //   let basicReq = httpMock.expectOne('http://localhost:3000/examples.json');
  //
  //   // basicReq.flush({cities: ["New York", "Chicago", "Denver"]});
  //   basicReq.flush([
  //     {id: 260, name: "webgl_geometry_cube.html"},
  //     {id: 326, name: "webgl_mirror.html"}]);
  //
  //   // httpMock.verify();
  //
  // });
  // fit('getExampleIds works', (done) =>
  //   inject([ExamplesService], (service: ExamplesService) => {
  //   // let files =['webgl_geometry_cube.html', 'webgl_mirror.html'];
  //   // let result = service.getExampleIds(['webgl_geometry_cube.html', 'webgl_mirror.html']);
  //   // done();
  //
  //   // expect(result.length).toEqual(2);
  //   // expect(typeof(result)).toEqual('object');
  //   // expect(keys(result).length).toEqual(2);
  //   let files = ['webgl_geometry_cube.html', 'webgl_mirror.html'];
  //
  //   // service.doSomething();
  //   service.getExampleIds(files)
  //   .subscribe(rsp => {
  //     console.log(`ut:getExampleIds: rsp=${rsp}`);
  //     done();
  //   });
  //
  //   let usaRequest = httpMock.expectOne('./assets/usa.json');
  //
  //   usaRequest.flush({cities: ["New York", "Chicago", "Denver"]});
  //
  // });
  //
  // })()); // note: an IIFE because injecting "done"

});
