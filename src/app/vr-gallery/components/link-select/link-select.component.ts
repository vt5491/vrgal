import { Component, OnInit } from '@angular/core';
import { CoreUtilsService } from '../../../core/services/core-utils.service';
// import { StickyPosService } from '../../aframe/sticky-pos.service';
import * as THREE from "three";

@Component({
  selector: 'app-link-select',
  templateUrl: './link-select.component.html',
  styleUrls: ['./link-select.component.css']
})
export class LinkSelectComponent implements OnInit {

  // constructor(stickyPos: StickyPosService ) {
  constructor(
    private utils : CoreUtilsService
  ) {
    console.log(`LinkSelectComponent.ctor: entered`);
  }

  ngOnInit() {
    var el = document.querySelector("a-log");

    el.setAttribute("visible", "false");

    this.registerViewSourceListeners();
  }

  registerViewSourceListeners() {
    let btn = null;
    // debugger;

    btn = document.querySelector('#vrize-webgl_lights_pointlights-view-source');

    // btn.addEventListener('click', function(evt) {
    btn.addEventListener('click', (evt) => {
      var logEl = document.querySelector("a-log");

      // toggle visibility
      let logVisibility = logEl.getAttribute("visible");
      // let newVisibility = 'true';
      let newVisibility = !logVisibility;

      // if (logVisibility == 'true') {
      //   newVisibility = 'false';
      // }
      logEl.setAttribute("visible", String(newVisibility));
      // (AFRAME as any).log('talking to <a-log>');
      // window.AFRAME.log('talking to <a-log>');
      // AFRAME.log('talking to <a-log>');
      // http://192.168.50.158:3002/src/assets/threejs-env/examples/vrize-webgl_geometry_cube.html
      let msg = this.utils
        // .getExampleObservable("http://192.168.50.158:3002/examples/webgl_animation_cloth.html")
        // .getExampleObservable("http://192.168.50.158:3002/examples/webgl_geometry_cube.html")
        .getExampleObservable("http://192.168.50.158:3002/src/assets/threejs-env/examples/vrize-webgl_geometry_cube.html")
        .subscribe( (rsp) => {
          (document.querySelector('a-scene') as any)
            .emit('log', {message: (rsp as any).data, channel: 'bar'});
          // debugger;
          console.log(`registerViewSouceListeners: data=${(rsp as any).data}`);
        })
    })
    // btn.addEventListener('click', function (evt) {
    //   console.log(`LinkSelectComponent: you clicked on vrize-webgl_lights_pointlights-view-source`);
    //   // var text2 = document.createElement('div');
    //   // text2.style.position = 'absolute';
    //   // //text2.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
    //   // text2.style.width = "100";
    //   // text2.style.height = "100";
    //   // text2.style.backgroundColor = "blue";
    //   // text2.innerHTML = "hi there!";
    //   // text2.style.top = 200 + 'px';
    //   // text2.style.left = 200 + 'px';
    //   // document.body.appendChild(text2);
      
    //   // el.setAttribute('visible', !el.getAttribute('visible'));
    //   let scene = (document.querySelector('a-scene') as any).object3D;
    //   var canvas1 = document.createElement('canvas');
    //   var context1 = canvas1.getContext('2d');
    //   // context1.font = "Bold 10px Arial";
    //   context1.font = "10px Arial";
    //   context1.fillStyle = "rgba(255,0,0,1)";
    //   context1.fillText('Hello, world!', 0, 60);

    //   // canvas contents will be used for a texture
    //   var texture1 = new THREE.Texture(canvas1)
    //   texture1.needsUpdate = true;

    //   var material1 = new THREE.MeshBasicMaterial({ map: texture1, side: THREE.DoubleSide });
    //   // material1.transparent = true;
    //   material1.transparent = false;

    //   var mesh1 = new THREE.Mesh(
    //     new THREE.PlaneGeometry(5, 5),
    //     material1
    //   );
    //   // mesh1.position.set(25, 5, -5);
    //   mesh1.position.set(0, 0, 0.1);
    //   // mesh1.rotation.x = -0.9;
    //   // shape.add(mesh1);
    //   // Note that mesh1 gets added to the shape and not to the scene

    //   // scene.add(shape)
    //   // debugger;
    //   (scene as any).add(mesh1);
    // });
  }

}
