// Register all the ng-generated tags in your application so that a-frame
// recognizes them as one of it its own, and thus properly inserts them into the
// scene.  If ng tags are not registered with a-frame then ng will only insert
// them into to the DOM but *not* into the a-frame scene.
// A-frame's 'registerPrimitive' *must* be called in angular's polyfill.js after
// 'aframe.js' and before 'zone.js'.
//
AFRAME.registerPrimitive('app-main', { mappings: {} });
AFRAME.registerPrimitive('app-query-sub', { mappings: {} });
AFRAME.registerPrimitive('app-result-sub', { mappings: {} });
AFRAME.registerPrimitive('app-config-panel', { mappings: {} });
//AFRAME.registerPrimitive('app-config-panel', { 
//  defaultComponents: {
//    'gui-radio': { }
//  }, 
//  mappings: {'checked': 'gui-radio.checked',} 
//});
AFRAME.registerPrimitive('app-help-panel', { mappings: {} });
AFRAME.registerPrimitive('app-header', { mappings: {} });
