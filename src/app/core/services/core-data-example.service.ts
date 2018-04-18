// This service should be for read-only operations done by public
// methods that need to read the examples.  All other admin activites
// against the rails examples table should be done in 'vrize.data-examples.service'
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/catch';

@Injectable()
export class CoreDataExampleService {
  server : URL;

  constructor(private http: HttpClient) { 
    this.server = new URL('http://localhost:4200');

  }

  get(example: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'text/plain',
        // 'Content-Type':  'text',
      })
    };
  
    let url = `${this.server}src/assets/threejs-env/examples/${example}`;
    console.log(`DataExamples.get: url=${url}`);

    // debugger;
    // // return this.http.get(url, httpOptions)
    // return this.http.get('src/assets/threejs-env/vrize-webgl_mirror.html', httpOptions)
    // return this.http.get('src/assets/threejs-env/vrize-webgl_mirror.html').catch((e) => { 
      debugger;
    // return this.http.get('src/assets/threejs-env/vrize-webgl_mirror.html');
    // return this.http.get('assets/threejs-env/vrize-webgl_mirror.html');
    return this.http.get('../../../assets/threejs-env/examples/vrize-webgl_mirror.html');
  // }
  // let fp='src/assets/threejs-env/vrize-webgl_mirror.html'; 
  // let fp = 'assets/threejs-env/examples/vrize-webgl_mirror.html';
  // let fp = './vrize-webgl_mirror.html';
  // let fp = '../../../assets/threejs-env/examples/vrize-webgl_mirror.html';
  // let file = new File([], fp);
  // var reader = new FileReader();

  // reader.addEventListener("load", function () {
  //   console.log(`getLiftedExample.load: result=${reader.result}`);

  //   debugger;
  //   // result.src = reader.result;
  // }, false);

  // if (fp) {
  //   reader.readAsText(file);
  // }
}

}
