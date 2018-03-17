import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { ExampleComponent } from '../../shared/components/example/example.component';

@Injectable()
export class ExamplesService {
  server : URL;

  constructor(private http: HttpClient) { 
    this.server = new URL('http://localhost:3000');
  }

  getMetaData() {
    this.get('examples/260')
      .subscribe(rsp => {
        console.log(`getMetaData: rsp=${rsp}`);
        console.log(`getMetaData: rsp.id=${(rsp as any).id}, rsp.name=${(rsp as any).name}`);
      })
  }

  get(route: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        // 'Content-Type':  'text',
      })
    };
  
  let url = `${this.server}${route}.json`;
  console.log(`MetaDataExamples.get: url=${url}`);
  

  return this.http.get(url, httpOptions)
  }

  setLifted(example: ExampleComponent) {
    // const myheader = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    // const body = new HttpParams().set('lifted', '1');
    // var body = {'lifted': '1'};
    var body = new Object();

    if (example.lifted == null) {
      // body['lifted'] = 1;
      body['lifted'] = true;
    }
    else {
      // body['lifted'] = example.lifted ? 1 : 0;
      body['lifted'] = example.lifted;
    }
    // body['lifted'] = false;
    console.log(`setLifted: body[lifted]=${body['lifted']}`);
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
