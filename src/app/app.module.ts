import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
// import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// user modules
import { AppComponent } from './app.component';
import { VrGalleryModule } from './vr-gallery/vr-gallery.module';
import { VrizeModule } from './vrize/vrize.module';
// components
import { AframeCubeComponent } from './vr-gallery/components/aframe-cube/aframe-cube.component';
import { LinkSelectComponent } from './vr-gallery/components/link-select/link-select.component';
import { QuerySelectComponent } from './vr-gallery/components/query-select/query-select.component';
import { ResultsSceneComponent } from './vr-gallery/components/results-scene/results-scene.component';
// services

const appRoutes:Routes = [
  {path: '', component: AframeCubeComponent},
  // {path: '', component: VrGalleryComponent},
  // {path: 'vr-gallery', component: VrGalleryComponent},
  // {path: 'plane-select', component: PlaneSelectComponent},
  {path: 'vr-gallery/link-select', component: LinkSelectComponent},
  // {path: 'sb', component: SbComponent},
  {path: 'vr-gallery/query-select', component: QuerySelectComponent},
  {path: 'vr-gallery/results-scene', component: ResultsSceneComponent},
  // {path: 'full-monty-scene', component: FullMontySceneComponent},
  // {path: 'results-scene', component: ResultsSceneComponent},
 ]

@NgModule({
  declarations: [
    AppComponent,
    // AframeCubeComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    VrGalleryModule,
    VrizeModule,
  ],
  providers: [
  ],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
