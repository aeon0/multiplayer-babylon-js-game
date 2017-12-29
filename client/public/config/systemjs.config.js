(function (global) {
    System.config({
      map: {
        // our app is within the js folder
        app: '/public/js'
      },
      // packages tells the System loader how to load when no filename and/or no extension
      packages: {
        app: {
          main: './src/controller.js',
          defaultExtension: 'js'
        }
      }
    });
  })(this);