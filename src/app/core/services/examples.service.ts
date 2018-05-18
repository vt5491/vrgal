// This is an interface to the meta-data-proxy server (port 1337)which is an
// express app that interfaces with rails (port 3000). There is also an express
// server that interfaces with the examples file data (port 3002), but this is
// only used during admin when lifting examples, and thus is not exposed the
// SPA.  This meta-data-proxy server gets data from the 'examples' table of the
// rails server (and its extensions, such as 'stats').  It is not intended for
// reading the examples (files) under $VRGAL/src/assets/threejs-env/examples'
// Consider using the general 'core-utils.service' to handle reading example
// files No: use core-data-example.service in core module. This should actually
// be called 'meta-data-examples' services.  Or more accurately,
// "meta-data-proxy-examples" since it interfaces with the meta-data proxy
// server (express) which in turns communicates with the rails meta-data
// examples server.
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { ExampleComponent } from '../../shared/components/example/example.component';
import { CoreBaseService } from './core-base.service';

@Injectable()
export class ExamplesService {
  server : URL;
  lift_successful : number;

  constructor(
    private base : CoreBaseService,
    private http: HttpClient
  ) {
    // this.server = new URL('http://localhost:3000');
    this.server = new URL(this.base.vrizeSvcUrl);

    this.lift_successful = 10;
  }

  getMetaData() {
    this.get('examples/260')
      .subscribe(rsp => {
        console.log(`getMetaData: rsp=${rsp}`);
        console.log(`getMetaData: rsp.id=${(rsp as any).id}, rsp.name=${(rsp as any).name}`);
      })
  }

  get(route: string, params?: HttpParams) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        // 'Content-Type':  'text',
        // I think these only have an effect if they're in the response headers
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials' : 'true'
      }),
      params: params
    };

  // let url = `${this.server}${route}.json`;
  // console.log(`MetaDataExamples.get: url=${url}`);
  console.log(`ExampleService.get: route=${route}`);
  //debugger;
  // return this.http.get(url, httpOptions)
  return this.http.get(route, httpOptions)
  }

  setLifted(example: ExampleComponent) {
    // const myheader = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    // const body = new HttpParams().set('lifted', '1');
    // var body = {'lifted': '1'};
    var body = new Object();

    body['example'] = {};

    // if (example.lifted == null) {
    // if (example.lift_code == null) {
    //   // body['lifted'] = 1;
    //   body['lifted'] = true;
    // }
    // else {
    //   // body['lifted'] = example.lifted ? 1 : 0;
    //   // body['lifted'] = example.lifted;//orig
    //   // body['lift_code'] = example.lift_code;
    //   body['lift_code'] = 10;
    // }
    // body['example']['lift_code'] = 10;
    // body['lift_code'] = example.lift_code;
    body['example']['lift_code'] = example.lift_code;
    // body['lifted'] = false;
    // console.log(`setLifted: body[lifted]=${body['lifted']}`);
    // body['lifted_at'] = "2018-03-16 22:00:00"


    // let url = 'examples/${example.id}';
    // let url = `${this.server}examples/${example.id}.json`;
    let url = `${this.server}examples/${example.id}.json`;

    this.put(url, body)
      .subscribe(rsp => {
        console.log(`Examples.service.setLifted: rsp=${rsp}`);
    });
  //   http
  //     .post('/api', body, {
  //       headers: myheader),
  // })
  // .subscribe();

  }

  put(route: string, body) {
    console.log(`Examples.service.post: route=${route}, body=${JSON.stringify(body)}`);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };

    // return this.http.post(route, JSON.stringify(body), httpOptions)
    return this.http.put(route, JSON.stringify(body), httpOptions)
    // return this.http.post(route, body, httpOptions)
    // return this.http.get(route,  httpOptions)

  }

  doSomething() {
    console.log(`ExamplesService.doSomething: entered`);
  }
  // call the meta-data (rails) server and get the example.id for the associated
  // array of file names.  We do this an array at a time so we can generate a
  // single query and generate less overhead.
  getExampleIds(files : Array<string>) {
    console.log(`ExamplesService.getExampleIds: entered`);

    let result = {};

    // let url = this.server.toString();
    let url = `${this.server}examples.json`;

    // let params = new HttpParams().set('names[]', names);
    let params = new HttpParams();

    for(let i=0; i< files.length; i++) {
      params = params.append('fns[]', files[i]);
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type' : 'application/json',
      }),
      params : params
    }

    return this.http.get(url, httpOptions);
  }

}
