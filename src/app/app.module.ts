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
// services

const appRoutes:Routes = [
  {path: '', component: AframeCubeComponent},
  // {path: '', component: VrGalleryComponent},
  // {path: 'vr-gallery', component: VrGalleryComponent},
  // {path: 'plane-select', component: PlaneSelectComponent},
  // {path: 'link-select', component: LinkSelectComponent},
  // {path: 'sb', component: SbComponent},
  // {path: 'query-select', component: QuerySelectComponent},
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
  providers: [],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
