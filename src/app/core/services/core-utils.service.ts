import { Injectable } from '@angular/core';
import { CoreBaseService } from './core-base.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';


import * as THREE from "three";
@Injectable()
export class CoreUtilsService {

  // This is used for transferring data between components.  Add a component specific
  // key, so you don't conflict with other components in case they're using this too.
  dataStore : {}

  constructor(
    private base: CoreBaseService,
    private http: HttpClient,
  ) {
    this.dataStore = {}
  }

  // don't use this for two reasons:
  // 1) a method to read examples belongs in 'examples.service'
  // 2) It introduces a dependency on the express server (port 3002).
  // Get request can be performed by the NG spa itself, and does not require
  // a node server (only posts, puts, and patches do)
  // getExampleObservable(apiURL: string) {
  //   try {
  //     return this.http.get(apiURL, {})
  //       .map(res => {
  //         let result = res;

  //         return result;
  //       });
  //   }
  //   catch(e) {
  //     console.log(`try-catch-1: e=${e}`);
  //   }
  // }

  getLiftedExample(fn: string) {
    let fp = `${this.base.examplesPath}/${this.base.liftPrefix}${fn}.html`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'text/plain',
      })
    };

    // return this.http.get(fp, httpOptions);
    return this.http.get(fp, {responseType: "text"});
  }
  // input is the root of the example name e.g. 'myExample.html'.  We will
  // generate the fully qualified path.
  // Note: this attempts to use native javascript 'FileReader' function, but I
  // think it only reads file on the client?  I think I need to use http get
  // to get the file on the server.
  getLiftedExample2(fn: string) {
    // let result = new Blob();
    let fp = `${this.base.examplesPath}/${this.base.liftPrefix}${fn}.html`;
    console.log(`getLiftedExample: fp=${fp}`);

    // let file = new File({fileName: fp});
    let file = new File([], fp);
    var reader  = new FileReader();

    reader.addEventListener("load", function () {
      console.log(`getLiftedExample.load: result=${reader.result}`);

      // debugger;
      // result.src = reader.result;
    }, false);

    if (fp) {
      reader.readAsText(file);
    }

  }

  escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  }

  // Given an element count and widthScaleFactor, return an object with the rows
  // and cols to fit the elements.  For example 100 elements with  a widthFactor
  // of 1.2 should return cols=12, rows = 9 (you need 9 rows of a 12-col tuple
  // to accomodate 100 elements such that the width is approximatley 20% wider
  // than it is higher).
  gridicize(elemCnt, widthFactor) {
    let result = {};
    let rows, cols : number;

    // start with a square grid
    rows = Math.sqrt(elemCnt);
    cols = rows;

    // and stretch to the width factor
    cols *= widthFactor;
    rows /= widthFactor;

    // integer-ize
    rows = Math.round(rows);
    cols = Math.round(cols);

    // simple hack: if we don't have enough slots, add a row.
    if (rows * cols < elemCnt) {
      rows++;
    }

    result['rows'] = rows;
    result['cols'] = cols;

    return result;
  }

  toggleVisibility(el) {
    let elVisibility = el.getAttribute("visible");
    el.setAttribute("visible", String(!elVisibility));
  };

  toggleSound(el) {
    // debugger;
    if (el.components.sound.isPlaying) {
      el.components.sound.pauseSound();
    }
    else {
      el.components.sound.playSound();
    }
  }


}
