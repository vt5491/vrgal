import { Component, OnInit } from '@angular/core';
import { LiftReqsService } from '../../services/lift-reqs.service';
import { LiftReq } from '../../classes/lift-req';

@Component({
  selector: 'app-lift-batch',
  templateUrl: './lift-batch.component.html',
  styleUrls: ['./lift-batch.component.css']
})
export class LiftBatchComponent implements OnInit {
  // liftReqs : Array<LiftReq>;
  liftReqs : Array<Object>;


  constructor(
    private liftReqsService : LiftReqsService 
  ) { 
    this.liftReqs = new Array();

  }

  ngOnInit() {
    this.liftReqsService.getIndex()
      .subscribe( rsp => {
        console.log(`LiftBatchService.getIndex rsp=${rsp}, rsp.length=${(rsp as any).length}`);

        let liftReqLen = (rsp as any).length;

        for(let i=0; i< liftReqLen; i++) {
          // this.liftReqs.push(JSON.parse(rsp[i]));
          this.liftReqs.push(rsp[i]);
        }

        // debugger;
        
      })
  }



}
