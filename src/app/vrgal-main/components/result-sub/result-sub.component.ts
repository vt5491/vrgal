import { Component, OnInit } from '@angular/core';
import { CoreBaseService } from '../../../core/services/core-base.service';
import { CoreUtilsService } from '../../../core/services/core-utils.service';
import { ExamplesService } from '../../../core/services/examples.service';

@Component({
  selector: 'app-result-sub',
  templateUrl: './result-sub.component.html',
  styleUrls: ['./result-sub.component.css']
})
export class ResultSubComponent implements OnInit {

  exampleResults : [any];

  constructor(
    private base: CoreBaseService,
    private utils: CoreUtilsService,
    private examples: ExamplesService,
  ) { }

  ngOnInit() {
  }

  queryGenResult(data) {
    console.log(`ResultSubComponent.queryGenResult: now processing query`)

    let result$ = this.examples.queryCurated();
    result$.subscribe(
      data => {this.addResults((data as any).examples)},
      err => {console.log(`err=${err}`);
    })
  }

  addResults(results) {
    console.log(`ResultSubComponent.addResults: results.length=${results.length}`);
    this.exampleResults = results;
    this.addLinks();
    this.addImgAssets();

    // and finally, make ourselves visible
    this.utils.toggleSubScenes();
  }

  addLinks() {
    for(let i=0; i < this.exampleResults.length; i++) {
      this.addLink(this.exampleResults[i], i);
    }

  }

  addLink(data, index) {
    console.log(`ResultsSubComponent.addLink: now creating link`);
    let linkParentEl = document.querySelector('#app-result-sub-links');
    let linkEl = document.createElement('a-entity');

    let linkAttributes = "";
    let href = `assets/threejs-env/examples/vrize-${data.name}`;
    linkAttributes += `href: ${href};`;
    linkAttributes += ` on: no-click;`
    linkAttributes += ` title: ${data.name};`
    let imgRoot = data['name'].replace(/\.html$/, '');
    linkAttributes += ` image: #${imgRoot}-thumb;`;
    linkAttributes += ` peekMode: "true";`
    linkEl.setAttribute('link', linkAttributes);
    // linkEl.setAttribute('position', `${data.pos.x} ${data.pos.y} ${data.pos.z}`);
    linkEl.setAttribute('position', `${2.5 * index} 0 0`);
    linkEl.setAttribute('id', `${imgRoot}-link`);
    // add in the rails example_id, so event handler can update stats
    let example_id = data.id;
    linkEl.setAttribute('example_id', example_id);
    // disable the system 'on' event handler
    // linkEl.setAttribute('on', 'no-click');
    // and define our own click handler (so we can increment stats before xferring)
    linkEl.addEventListener('click', (evt) => {
      // save the appStore
      //vt-xthis.utils.saveAppState(this.ngRedux);
      // console.log(`now in user click handler`);
      // note: we just use a closure to specify the example_id instead of reading
      // the attribute since we have one event handler per link anyway.
      this.examples.incExampleStat(example_id, "clicks")
        .subscribe(rsp => {
          console.log(`click: stats now updated`);
        },
        (err) => {console.log(`ResultsSceneComponent.clickHandler: err=${err}`)},
        // the finally block.. transfer in all cases, even if stats *not* updated
        () => { (window as any).location=href}
      )
    });
    //
    linkParentEl.appendChild(linkEl);

    this.examples.addLinkHoverEvtListener(linkEl);

    // increments impressions stats
    // impressions stats are updated at query level since every refresh of
    // the results scene would drive the impressions count.
    // this.incImpressions(example_id);
  }

  // add thumbs to the assets list
  addImgAssets() {
    for (let i = 0; i < this.exampleResults.length; i++) {
    // for(let i=0; i < Object.keys(this.exampleResults).length; i++) {
      // this.addImgAsset(this.exampleResults[i], i);
      let k = Object.keys(this.exampleResults)[i];
      this.addImgAsset(this.exampleResults[k], i);
    }
  }

  addImgAsset(data, index) {
    let scene: any = document.querySelector('a-scene');
    let appPrefix = this.base.appPrefix

    let evtDetail = {}
    // debugger;
    let imgRoot = data['name'].replace(/\.html$/, '')
    // evtDetail['src'] = `assets/img/thumbs/${imgRoot}_thumb.png`;
    evtDetail['src'] = `assets/img/thumbs/${imgRoot}-thumb.png`;
    evtDetail['id'] = `${imgRoot}-thumb`;

    let evt = new CustomEvent(`${appPrefix}_create_img_asset`, { detail: evtDetail });
    evt.initEvent(`${appPrefix}_create_img_asset`, true, true);
    // scene.emit(`${appPrefix}_createlink`);
    //note: 'createlink' events are handled 'src/assets/libs/aframe/system-utils.js
    scene.dispatchEvent(evt)
  }

}
