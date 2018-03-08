import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreBaseService } from './services/core-base.service';
import { CoreUtilsService } from './services/core-utils.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    CoreBaseService,
    CoreUtilsService,
  ],
  declarations: []
})
export class CoreModule { }
