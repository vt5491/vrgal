import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { HttpClientModule } from '@angular/common/http';
import {FormsModule} from '@angular/forms';

//services
import { BaseService } from './services/base.service';
import { UtilsService } from './services/utils.service';
import { ParserService } from './services/parser.service';
import { TransformerService } from './services/transformer.service';
import { DataExamplesService } from './services/data-examples.service';
import { ExamplesService } from '../core/services/examples.service';
import { LiftReqsService } from './services/lift-reqs.service';
//components
import { LiftComponent } from './components/lift/lift.component';
import { LiftBatchComponent } from './components/lift-batch/lift-batch.component';
// Note: this is public DataExampleComponent.  Vrize needs the admin verion.
// import { DataExampleComponent } from '../shared/components/data-example/data-example.component';

const vrizeRoutes:Routes = [
  { path: 'lift', component: LiftComponent, },
  { path: 'lift-batch', component: LiftBatchComponent,}
]

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    // RouterModule.forRoot(vrizeRoutes),
    RouterModule.forChild(vrizeRoutes),
  ],
  declarations: [LiftComponent, LiftBatchComponent],
  providers: [
    UtilsService,
    BaseService,
    ParserService,
    TransformerService,
    DataExamplesService,
    ExamplesService,
    LiftReqsService,
  ],
  // we need this since we dynamically add this route
  entryComponents: [LiftComponent]
})
export class VrizeModule { }
