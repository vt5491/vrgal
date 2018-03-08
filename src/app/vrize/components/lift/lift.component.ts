// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-lift',
//   templateUrl: './lift.component.html',
//   styleUrls: ['./lift.component.css']
// })
// export class LiftComponent implements OnInit {

//   constructor() { }

//   ngOnInit() {
//   }

// }
import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { TransformerService } from '../../services/transformer.service';
import { ParserService } from '../../services/parser.service';
import { ExamplesService } from '../../services/examples.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-lift',
  templateUrl: './lift.component.html',
  styleUrls: ['./lift.component.css']
})

export class LiftComponent implements OnInit {
  inputDoc: Document;
  inputString : string;
  outputText: string;
  testFiles : string[];
  testFileLookup : {};
  fn : string;

  constructor(
    private http: HttpClient,
    private transformer: TransformerService,
    private parser: ParserService,
    private examples: ExamplesService,
  )
    {
      this.testFiles = [
        'webgl_geometry_cube.html',
        'webgl_geometries.html',
        'webgl_shaders_ocean.html',
        'webgl_shaders_ocean2.html(x)',
        'webgl_mirror.html'
      ];

      this.testFileLookup = new Object();
      // this.testFileLookup['webgl_geometry_cube.html'] = '../../../../../assets/test/examples/unix_style/webgl_geometry_cube.html';
      // this.testFileLookup['webgl_geometries.html'] = '../../../../../assets/test/examples/unix_style/webgl_geometries.html';
      // this.testFileLookup['webgl_shaders_ocean.html'] = '../../../../../assets/test/examples/unix_style/webgl_shaders_ocean.html';
      // this.testFileLookup['webgl_shaders_ocean2.html(x)'] = '../../../../../assets/test/examples/unix_style/webgl_shaders_ocean2.html';
      // this.testFileLookup['webgl_mirror.html'] = '../../../../../assets/test/examples/unix_style/webgl_mirror.html';

      this.testFileLookup['webgl_geometry_cube.html'] = '../../../../../assets/threejs-env/examples/webgl_geometry_cube.html';

      // default to the default file in the select dropdown.
      this.fn = this.testFileLookup['webgl_geometry_cube.html'];
  }

  ngOnInit() {
  }

  onSubmit(f: NgForm) {
    console.log(`lift.onSubmit: entered, f.value=${f.controls.inputText.value}`);
    console.log(`f.value=${f.value}`);
    // console.log(`testFile.value=${testFile.value}`);
    // debugger;
    let inputText = f.controls.inputText.value;
    if (inputText) {
      this.userLift(inputText);

      this.outputText = _.unescape(
        new XMLSerializer().serializeToString(this.inputDoc));
    }
    else {
      this.http.get(this.fn, {responseType: 'text'})
      .subscribe(
        data => {
          this.inputString = data;
          // console.log(`inputString=${this.inputString}`);
          this.userLift(this.inputString);
          // this.outputText = new XMLSerializer().serializeToString(this.inputDoc);
          // Note: we have to call decodeURI to get rid of things like '&lt;' in the
          // javascript (XMLSerializer will escape all the javascript)
          // debugger;
          this.outputText = _.unescape(
          new XMLSerializer().serializeToString(this.inputDoc));
          console.log(`outputText=${this.outputText}`);
        },
        (err: HttpErrorResponse) => {
          console.log('parseHtml: err=' + err, 'httperror=' + err.error);
        },
        () => {
          //TODO: put calls for other files here and put the 'done()' call in the last of the chain
          console.log('webgl_geometries loaded');
        }
      );

    }

    // let fn = '../../assets/test/examples/unix_style/webgl_geometry_cube.html';
    // let fn = '../../assets/test/examples/unix_style/webgl_geometries.html';
    // let fn = '../../assets/test/examples/unix_style/webgl_shaders_ocean.html';

    // this.userlift(this.inputString);
    // this.outputText = new XMLSerializer().serializeToString(this.inputDoc);
    // console.log(`outputText=${this.outputText}`);
  }

  onChange(fn) {
    console.log(`onChange: fn=${fn}`);
    this.fn = this.testFileLookup[fn];
    console.log(`this.fn=${this.fn}`);
  }

  onClick(e) {
    console.log(`onClick: e=${e}`);

  }
  // userlift(e : Event) {
  userLift(inputText : string) {
    // console.log(`lift.userlift: e=${e});
    // console.log(`lift.userlift: inputText=${inputText}`);
    // console.log(`lift.userlift: inputText.value=${inputText.value}`);
    // let el = document.querySelector('#inputText');
    // let inputHtml = el.innerHTML;
    let inputHtml = inputText;
    // console.log(`lift.userlift: inputText.value=${el.innerHTML}`);
    // console.log(`lift.userlift: inputText.value=${inputText}`);
    //
    let domParser = new DOMParser();

    this.inputDoc = domParser.parseFromString(inputHtml, "text/html");
    // let inputDoc = domParser.parseFromString(this.inputString, "text/html");

    this.transformer.liftDoc(this.inputDoc);

    // console.log(`userlift: output=${inputDoc.scripts[3].innerHTML}`);
  }

  commitExample(e: Event) {
    console.log(`liftComponent.commitExample: e=${e}`);
    // console.log(`liftComponent.vrizePost: entered`);

    // this.examples.get('src/assets/threejs-env/examples/webgl_geometry_cube.html', "David Bowie")
    // .subscribe((rsp) => {
    //   console.log(`subscribe: rsp=${rsp}`);
    // }) ;
    // console.log(`liftComponent.vrizeGet: back from get`);
    // this.examples.put('src/assets/threejs-env/examples/webgl_geometry_cube.html', "Angus Young")
    this.examples.put('src/assets/threejs-env/examples/abc.html', "Angus Young")
    .subscribe((rsp) => {
      console.log(`subscribe: rsp=${rsp}`);
    })
    ;
    console.log(`liftComponent.vrizePost: back from put`);
  }
}

