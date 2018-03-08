AFRAME.registerSystem('system-base', {
  schema: {
    appPrefix: {default: 'VRGAL'},
    vrizeSvcUrl: {default: 'http://192.168.1.147:3000'}
  },
  init: function () {
    console.log(`system-base.init: entered`);
  }
});
