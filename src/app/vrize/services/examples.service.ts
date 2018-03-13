import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class ExamplesService {
  server : URL;

  constructor(private http: HttpClient) {
    this.server = new URL('http://localhost:3002');

  }

  get(route: string, text: string) {
    // let headers = new Headers();
    // headers.append('Content-Type', 'application/json');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'text/plain',
        // 'Access-Control-Allow-Origin': 'http://localhost:5200'
        // 'Access-Control-Allow-Origin': '*',
        // 'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
        // 'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
      })
    };

    // let url = `${this.server}/${fn}`;
    let url = `${this.server}${route}`;
    // let url = `${this.server}src/assets/threejs-env/${route}`;
    console.log(`ExampleService.get: url=${url}`);


    return this.http
      .get(url,  httpOptions )
      // .put(url,)
      // .map(res => res.text());
  }

  // Create a new Example
  post(route: string, text) {
    // console.log(`ExamplesService.post: path=${path}, text=${text}`);
    console.log(`ExamplesService.post: path=${route}`);
    
    const httpOptions = {
      headers: new HttpHeaders({
        // 'Content-Type': 'text/plain',
        'Content-Type': 'application/json',
      }),
      responseType : 'text'
    };
    // responseType: 'text'

    // let url = this.server + '/' + path;
    let url = this.server + route;
    // let url = `${this.server}${route}`;

    console.log(`exampleService.post: url=${url}`);
    
    return this.http
      .post(url, { text: text }, httpOptions as any);
    //   .post(url, {text: text},      {
    //     headers: new HttpHeaders().set('Content-Type', 'application/json'),
    //     responseType: 'text' 
    //  })
  }

  // Update existing Example
  put(fn: string, text: string) {
    // let headers = new Headers();
    // headers.append('Content-Type', 'application/json');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'text/plain',
        // 'Access-Control-Allow-Origin': 'http://localhost:5200'
        // 'Access-Control-Allow-Origin': '*',
        // 'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
        // 'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
      })
    };

    // let url = `${this.server}/${fn}`;
    let url = `${this.server}`;
    console.log(`ExampleService.put: url=${url}`);

    // let postObj = { fn : text};
    let postObj = new Object();
    postObj[fn] = text;


    return this.http
      // .put(url, JSON.stringify(fn), httpOptions )
      .put(url, postObj, httpOptions )
      // .map(res => res.text());
  }



}
