import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';

import { CoreBaseService } from '../core/services/core-base.service';
import { CoreUtilsService } from '../core/services/core-utils.service';
import { LinkSelectComponent } from './components/link-select/link-select.component';
import { QuerySelectComponent } from './components/query-select/query-select.component';
import { AframeCubeComponent } from './components/aframe-cube/aframe-cube.component';
import { ResultsSceneComponent } from './components/results-scene/results-scene.component';
// import { ConfigComponent } from './components/config/config.component';
import { ConfigPanelComponent } from './components/config-panel/config-panel.component';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
  ],
  providers: [
    ConfigPanelComponent,
  ],
  declarations: [
    LinkSelectComponent,
    QuerySelectComponent,
    AframeCubeComponent,
    ResultsSceneComponent,
    ConfigPanelComponent,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class VrGalleryModule { }
