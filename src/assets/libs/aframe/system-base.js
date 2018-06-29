AFRAME.registerSystem('system-base', {
  schema: {
    // appPrefix: {default: 'VRGAL'},
    // Note: if you updated appPrefix, you *must* also update the angular side:
    // file 'app/core/services/core.service.ts'
    appPrefix: {default: 'vrgal5491'},
    vrizeSvcUrl: {default: 'http://192.168.1.147:3000'},
    examplesPath: {default: 'src/assets/threejs-env/examples'},
    liftPrefix: {default: 'vrize-'}
  },
  init: function () {
    console.log(`system-base.init: entered`);
  }
});
