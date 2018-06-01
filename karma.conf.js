// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
//vt add
// const aframe = require('aframe');
//vt end

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      //vt add
      require('karma-firefox-launcher'),
      // require('karma-mocha-reporter'),
      //vt end
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    //vt add
    // customContextFile: './src/environments/context_aframe_ut.html',
    // customClientContextFile: './src/environments/context_aframe_ut.html',
    // files: [
    //   // 
    //   //user add
    //   { pattern: 'node_modules/aframe/dist/aframe-master.js', included: false, served: true },
    //   { pattern: 'node_modules/three/build/three.js', included: false, served: true }
    //   //user end
    // ],
    //vt end
    client:{
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, 'coverage'), reports: [ 'html', 'lcovonly' ],
      fixWebpackSourcePaths: true
    },
    angularCli: {
      environment: 'dev'
    },
    reporters: ['progress', 'kjhtml'],
    // reporters: ['progress', 'kjhtml', 'karma-mocha-reporter'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    // browsers: ['Firefox'],
    singleRun: false
  });
};
