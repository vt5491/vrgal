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
import { DataExamplesService } from '../../services/data-examples.service';
import { MetaDataExamplesService } from '../../../core/services/meta-data-examples.service';
import { environment } from '../../../../environments/environment';

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
  writeToTmp : boolean;

  constructor(
    private http: HttpClient,
    private transformer: TransformerService,
    private parser: ParserService,
    private dataExamples: DataExamplesService,
    private metaDataExamples: MetaDataExamplesService,
  )
    {
      this.testFiles = [
        'webgl_geometry_cube.html',
        'webgl_geometries.html',
        'webgl_shaders_ocean.html',
        'webgl_shaders_ocean2.html(x)',
        'webgl_mirror.html',
        'simple.html'
      ];

      this.testFileLookup = new Object();
      //Note: this lookup is no longer really needed since we let the server
      // come up with the full path name.
      // this.testFileLookup['webgl_geometry_cube.html'] = '../../../../../assets/test/examples/unix_style/webgl_geometry_cube.html';
      // this.testFileLookup['webgl_geometries.html'] = '../../../../../assets/test/examples/unix_style/webgl_geometries.html';
      // this.testFileLookup['webgl_shaders_ocean.html'] = '../../../../../assets/test/examples/unix_style/webgl_shaders_ocean.html';
      // this.testFileLookup['webgl_shaders_ocean2.html(x)'] = '../../../../../assets/test/examples/unix_style/webgl_shaders_ocean2.html';
      // this.testFileLookup['webgl_mirror.html'] = '../../../../../assets/test/examples/unix_style/webgl_mirror.html';

      this.testFileLookup['webgl_geometry_cube.html'] = '../../../../../assets/threejs-env/examples/webgl_geometry_cube.html';

      // default to the default file in the select dropdown.
      // this.fn = this.testFileLookup['webgl_geometry_cube.html'];
      this.fn = 'webgl_geometry_cube.html';

      this.writeToTmp = !environment.production;
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
      this.lift(inputText);

      this.outputText = _.unescape(
        new XMLSerializer().serializeToString(this.inputDoc));
    }
    else {
      this.dataExamples.get(
        `examples/${this.fn}`, 
        ({responseType : 'text'} as any))
      .subscribe((rsp) => {
        // debugger;
        // console.log(`onSubmit: rsp.data=${rsp.data}`);
        // this.inputString = data;
        this.inputString = (rsp as any).data;
        // console.log(`inputString=${this.inputString}`);
        this.lift(this.inputString);
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

  }

  onChange(fn) {
    console.log(`onChange: fn=${fn}`);
    // this.fn = this.testFileLookup[fn];
    this.fn = fn;
    console.log(`this.fn=${this.fn}`);
  };

  onClick(e) {
    console.log(`onClick: e=${e}`);

  }

  // toggleWriteToTmp(e: Event) {
  toggleWriteToTmp() {
    console.log(`toggleWriteToTmp.pre: this.writeToTmp=${this.writeToTmp}`);
    this.writeToTmp = !(this.writeToTmp);
    console.log(`toggleWriteToTmp.post: this.writeToTmp=${this.writeToTmp}`);

    this.dataExamples.writeToTmp = this.writeToTmp;
  }

  // userlift(e : Event) {
  lift(inputText : string) {
    let inputHtml = inputText;
    //
    let domParser = new DOMParser();

    this.inputDoc = domParser.parseFromString(inputHtml, "text/html");

    this.transformer.liftDoc(this.inputDoc);
  }

  // This is basically just the call to either update an existing file
  // or to create it if doesn't exist.  We leave it to the server to decide
  // which case it is.  Thus, we just do a POST and don't do a POST (create) 
  // vs PUT (update)
  commitExample(e: Event) {
    // form.controls['cb-use-tmp'].value; 
    console.log(`LiftComponent.commitExample: this.writeToTmp=${this.writeToTmp}`); 
    this.dataExamples.post(
      `examples/${this.fn}`, this.outputText  
    )
    .subscribe((rsp) => {
      console.log(`commitExample: rsp=${rsp}`);
    })

  }

  createExample(e: Event) {
    this.dataExamples.post(
      'src/assets/threejs-env/examples/abc.html', 
      "Ritchie Blackmore"
    //   {
    //     // headers: new HttpHeaders().set('Content-Type', 'application/json'),
    //     responseType: 'text' 
    //  } 
    )
    .subscribe((rsp) => {
      console.log(`createExample: rsp=${rsp}`);
    })
  }

  getExampleMetaData(e: Event) {
    this.metaDataExamples.getMetaData();
  }
}

