import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { TransformerService } from '../../services/transformer.service';
import { ParserService } from '../../services/parser.service';
import { LiftReqsService } from '../../services/lift-reqs.service';
import { LiftReq } from '../../classes/lift-req';
import { DataExamplesService } from '../../services/data-examples.service';
import { ExamplesService } from '../../../core/services/examples.service';
import { ExampleComponent } from '../../../shared/components/example/example.component';
import { environment } from '../../../../environments/environment';

import * as _ from 'lodash';

@Component({
  selector: 'app-lift-batch',
  templateUrl: './lift-batch.component.html',
  styleUrls: ['./lift-batch.component.css']
})
export class LiftBatchComponent implements OnInit {
  // liftReqs : Array<LiftReq>;
  liftReqs : Array<Object>;
  exampleDoc: Document;
  writeToTmp : boolean;


  constructor(
    private liftReqsService : LiftReqsService,
    private http: HttpClient,
    private transformer: TransformerService,
    private parser: ParserService,
    private dataExamples: DataExamplesService,
    private examples: ExamplesService
  ) {
    this.liftReqs = new Array();

    this.writeToTmp = !environment.production;
  }

  ngOnInit() {
    this.initLiftReqs();
  }

  initLiftReqs() {
    // debugger;
    this.liftReqsService.getIndex()
      .subscribe( data => {
        console.log(`LiftBatchService.getIndex data=${data}, data.length=${(data as any).length}`);
        console.log(`LiftBatchService: data.stringify=${JSON.stringify(data)}`);

        let liftReqLen = (data as any).length;

        for(let i=0; i< liftReqLen; i++) {
          // this.liftReqs.push(JSON.parse(data[i]));
          this.liftReqs.push(data[i]);
        }

        // debugger;

      })
  }

  liftBatch(e) {
    console.log(`LiftBatchComponent.liftBatch: entered`);
    for (let i = 0; i < this.liftReqs.length; i++) {

      let fn = (this.liftReqs[i] as any).example.name;
      console.log(`LiftBatchComponent.liftBatch: fn=${fn}`);
      this.dataExamples.get(
        `examples/${fn}`,
        ({ responseType: 'text' } as any))
        .subscribe((rsp) => {
          let exampleText = (rsp as any).data;
          this.lift(exampleText);
          // Note: we have to call decodeURI to get rid of things like '&lt;' in the
          // javascript (XMLSerializer will escape all the javascript)
          let liftedText = _.unescape(
            new XMLSerializer().serializeToString(this.exampleDoc));
          console.log(`LiftBatchComponent.liftBatch: liftedText=${liftedText}`);

          this.commitExample(liftedText, fn, (this.liftReqs[i] as any).example.id)

        },
        (err: HttpErrorResponse) => {
          console.log('parseHtml: err=' + err, 'httperror=' + err);
        },
        () => {
          //TODO: put calls for other files here and put the 'done()' call in the last of the chain
          console.log(`${fn} loaded`);
        })
    }
  }

  lift(inputText : string) {
    let inputHtml = inputText;
    //
    let domParser = new DOMParser();

    this.exampleDoc = domParser.parseFromString(inputHtml, "text/html");

    this.transformer.liftDoc(this.exampleDoc);
  }

  commitExample(liftedText, fn, exampleId) {
    // form.controls['cb-use-tmp'].value;
    console.log(`LiftComponent.commitExample: this.writeToTmp=${this.writeToTmp}`);
    // This is basically just the call to either update an existing file
    // or to create it if doesn't exist.  We leave it to the server to decide
    // which case it is.  Thus, we just do a POST and don't do a POST (create)
    // vs PUT (update)
    this.dataExamples.post(
      `examples/${fn}`, liftedText
    )
    .subscribe((rsp) => {
      console.log(`commitExample: rsp=${rsp}`);
      // and let meta-data server know that that example has been lifted.
      let example = new ExampleComponent();

      // console.log(`commitExample: fn=${fn}, fn.id=${this.testFileIdLookup[this.fn]}`);

      // example.id = this.testFileIdLookup[this.fn];
      example.id = exampleId;
      // example.id = 260
      // example.name = this.fn;
      // if lifted is already true, rails won't schedule the request. Nice
      // feature, except it doesn't cause 'lifted_at' (and indirectly
      // 'updated_at') to get driven.  So we need to set it to false, and
      // then true to get these to change.
      // example.lifted = false;
      // // example.lifted = 0;
      // this.examples.setLifted(example);

      // example.lifted = true;
      // example.lift_code = 10;
      example.lift_code = this.examples.lift_successful;
      // example.lifted = false;
      // // example.lifted = 1;
      this.examples.setLifted(example);
    })

  }

  toggleWriteToTmp() {
    console.log(`toggleWriteToTmp.pre: this.writeToTmp=${this.writeToTmp}`);
    this.writeToTmp = !(this.writeToTmp);
    console.log(`toggleWriteToTmp.post: this.writeToTmp=${this.writeToTmp}`);

    this.dataExamples.writeToTmp = this.writeToTmp;
  }


}
