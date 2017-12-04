
var Module;

if (typeof Module === 'undefined') Module = eval('(function() { try { return Module || {} } catch(e) { return {} } })()');

if (!Module.expectedDataFileDownloads) {
  Module.expectedDataFileDownloads = 0;
  Module.finishedDataFileDownloads = 0;
}
Module.expectedDataFileDownloads++;
(function() {
 var loadPackage = function(metadata) {

    var PACKAGE_PATH;
    if (typeof window === 'object') {
      PACKAGE_PATH = window['encodeURIComponent'](window.location.pathname.toString().substring(0, window.location.pathname.toString().lastIndexOf('/')) + '/');
    } else if (typeof location !== 'undefined') {
      // worker
      PACKAGE_PATH = encodeURIComponent(location.pathname.toString().substring(0, location.pathname.toString().lastIndexOf('/')) + '/');
    } else {
      throw 'using preloaded data can only be done on a web page or in a web worker';
    }
    var PACKAGE_NAME = 'game.data';
    var REMOTE_PACKAGE_BASE = 'game.data';
    if (typeof Module['locateFilePackage'] === 'function' && !Module['locateFile']) {
      Module['locateFile'] = Module['locateFilePackage'];
      Module.printErr('warning: you defined Module.locateFilePackage, that has been renamed to Module.locateFile (using your locateFilePackage for now)');
    }
    var REMOTE_PACKAGE_NAME = typeof Module['locateFile'] === 'function' ?
                              Module['locateFile'](REMOTE_PACKAGE_BASE) :
                              ((Module['filePackagePrefixURL'] || '') + REMOTE_PACKAGE_BASE);
  
    var REMOTE_PACKAGE_SIZE = metadata.remote_package_size;
    var PACKAGE_UUID = metadata.package_uuid;
  
    function fetchRemotePackage(packageName, packageSize, callback, errback) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', packageName, true);
      xhr.responseType = 'arraybuffer';
      xhr.onprogress = function(event) {
        var url = packageName;
        var size = packageSize;
        if (event.total) size = event.total;
        if (event.loaded) {
          if (!xhr.addedTotal) {
            xhr.addedTotal = true;
            if (!Module.dataFileDownloads) Module.dataFileDownloads = {};
            Module.dataFileDownloads[url] = {
              loaded: event.loaded,
              total: size
            };
          } else {
            Module.dataFileDownloads[url].loaded = event.loaded;
          }
          var total = 0;
          var loaded = 0;
          var num = 0;
          for (var download in Module.dataFileDownloads) {
          var data = Module.dataFileDownloads[download];
            total += data.total;
            loaded += data.loaded;
            num++;
          }
          total = Math.ceil(total * Module.expectedDataFileDownloads/num);
          if (Module['setStatus']) Module['setStatus']('Downloading data... (' + loaded + '/' + total + ')');
        } else if (!Module.dataFileDownloads) {
          if (Module['setStatus']) Module['setStatus']('Downloading data...');
        }
      };
      xhr.onload = function(event) {
        var packageData = xhr.response;
        callback(packageData);
      };
      xhr.send(null);
    };

    function handleError(error) {
      console.error('package error:', error);
    };
  
      var fetched = null, fetchedCallback = null;
      fetchRemotePackage(REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE, function(data) {
        if (fetchedCallback) {
          fetchedCallback(data);
          fetchedCallback = null;
        } else {
          fetched = data;
        }
      }, handleError);
    
  function runWithFS() {

    function assert(check, msg) {
      if (!check) throw msg + new Error().stack;
    }
Module['FS_createPath']('/', '.idea', true, true);
Module['FS_createPath']('/', 'audio', true, true);
Module['FS_createPath']('/', 'graphics', true, true);
Module['FS_createPath']('/', 'libs', true, true);
Module['FS_createPath']('/libs', 'gooi', true, true);
Module['FS_createPath']('/', 'maps', true, true);

    function DataRequest(start, end, crunched, audio) {
      this.start = start;
      this.end = end;
      this.crunched = crunched;
      this.audio = audio;
    }
    DataRequest.prototype = {
      requests: {},
      open: function(mode, name) {
        this.name = name;
        this.requests[name] = this;
        Module['addRunDependency']('fp ' + this.name);
      },
      send: function() {},
      onload: function() {
        var byteArray = this.byteArray.subarray(this.start, this.end);

          this.finish(byteArray);

      },
      finish: function(byteArray) {
        var that = this;

        Module['FS_createDataFile'](this.name, null, byteArray, true, true, true); // canOwn this data in the filesystem, it is a slide into the heap that will never change
        Module['removeRunDependency']('fp ' + that.name);

        this.requests[this.name] = null;
      },
    };

        var files = metadata.files;
        for (i = 0; i < files.length; ++i) {
          new DataRequest(files[i].start, files[i].end, files[i].crunched, files[i].audio).open('GET', files[i].filename);
        }

  
    function processPackageData(arrayBuffer) {
      Module.finishedDataFileDownloads++;
      assert(arrayBuffer, 'Loading data file failed.');
      assert(arrayBuffer instanceof ArrayBuffer, 'bad input to processPackageData');
      var byteArray = new Uint8Array(arrayBuffer);
      var curr;
      
        // copy the entire loaded file into a spot in the heap. Files will refer to slices in that. They cannot be freed though
        // (we may be allocating before malloc is ready, during startup).
        if (Module['SPLIT_MEMORY']) Module.printErr('warning: you should run the file packager with --no-heap-copy when SPLIT_MEMORY is used, otherwise copying into the heap may fail due to the splitting');
        var ptr = Module['getMemory'](byteArray.length);
        Module['HEAPU8'].set(byteArray, ptr);
        DataRequest.prototype.byteArray = Module['HEAPU8'].subarray(ptr, ptr+byteArray.length);
  
          var files = metadata.files;
          for (i = 0; i < files.length; ++i) {
            DataRequest.prototype.requests[files[i].filename].onload();
          }
              Module['removeRunDependency']('datafile_game.data');

    };
    Module['addRunDependency']('datafile_game.data');
  
    if (!Module.preloadResults) Module.preloadResults = {};
  
      Module.preloadResults[PACKAGE_NAME] = {fromCache: false};
      if (fetched) {
        processPackageData(fetched);
        fetched = null;
      } else {
        fetchedCallback = processPackageData;
      }
    
  }
  if (Module['calledRun']) {
    runWithFS();
  } else {
    if (!Module['preRun']) Module['preRun'] = [];
    Module["preRun"].push(runWithFS); // FS is not initialized yet, wait for it
  }

 }
 loadPackage({"files": [{"audio": 0, "start": 0, "crunched": 0, "end": 152, "filename": "/conf.lua"}, {"audio": 0, "start": 152, "crunched": 0, "end": 1663, "filename": "/main.lua"}, {"audio": 0, "start": 1663, "crunched": 0, "end": 1999, "filename": "/.idea/LD40 - Deadline Master.iml"}, {"audio": 0, "start": 1999, "crunched": 0, "end": 2295, "filename": "/.idea/modules.xml"}, {"audio": 0, "start": 2295, "crunched": 0, "end": 2475, "filename": "/.idea/vcs.xml"}, {"audio": 0, "start": 2475, "crunched": 0, "end": 32235, "filename": "/.idea/workspace.xml"}, {"audio": 1, "start": 32235, "crunched": 0, "end": 172559, "filename": "/audio/all_right.wav"}, {"audio": 1, "start": 172559, "crunched": 0, "end": 659137, "filename": "/audio/music-old1.wav"}, {"audio": 1, "start": 659137, "crunched": 0, "end": 2594585, "filename": "/audio/music.wav"}, {"audio": 1, "start": 2594585, "crunched": 0, "end": 2650503, "filename": "/audio/right.wav"}, {"audio": 1, "start": 2650503, "crunched": 0, "end": 2723743, "filename": "/audio/wrong.wav"}, {"audio": 0, "start": 2723743, "crunched": 0, "end": 2724129, "filename": "/graphics/correct.png"}, {"audio": 0, "start": 2724129, "crunched": 0, "end": 2725326, "filename": "/graphics/down.png"}, {"audio": 0, "start": 2725326, "crunched": 0, "end": 2726518, "filename": "/graphics/left.png"}, {"audio": 0, "start": 2726518, "crunched": 0, "end": 2727305, "filename": "/graphics/msgBox.png"}, {"audio": 0, "start": 2727305, "crunched": 0, "end": 2728493, "filename": "/graphics/right.png"}, {"audio": 0, "start": 2728493, "crunched": 0, "end": 2729681, "filename": "/graphics/up.png"}, {"audio": 0, "start": 2729681, "crunched": 0, "end": 2730538, "filename": "/graphics/wall.png"}, {"audio": 0, "start": 2730538, "crunched": 0, "end": 2731231, "filename": "/libs/audioMana.lua"}, {"audio": 0, "start": 2731231, "crunched": 0, "end": 2745161, "filename": "/libs/Camera.lua"}, {"audio": 0, "start": 2745161, "crunched": 0, "end": 2745240, "filename": "/libs/controls.lua"}, {"audio": 0, "start": 2745240, "crunched": 0, "end": 2751089, "filename": "/libs/ripple.lua"}, {"audio": 0, "start": 2751089, "crunched": 0, "end": 2751827, "filename": "/libs/stateMana.lua"}, {"audio": 0, "start": 2751827, "crunched": 0, "end": 2753867, "filename": "/libs/uiMana.lua"}, {"audio": 0, "start": 2753867, "crunched": 0, "end": 2754721, "filename": "/libs/virusMana.lua"}, {"audio": 0, "start": 2754721, "crunched": 0, "end": 2758430, "filename": "/libs/workMana.lua"}, {"audio": 0, "start": 2758430, "crunched": 0, "end": 2773155, "filename": "/libs/gooi/component.lua"}, {"audio": 0, "start": 2773155, "crunched": 0, "end": 2852162, "filename": "/libs/gooi/gooi.lua"}, {"audio": 0, "start": 2852162, "crunched": 0, "end": 2853771, "filename": "/libs/gooi/init.lua"}, {"audio": 0, "start": 2853771, "crunched": 0, "end": 2857889, "filename": "/libs/gooi/layout.lua"}, {"audio": 0, "start": 2857889, "crunched": 0, "end": 2868619, "filename": "/libs/gooi/utf8.lua"}, {"audio": 0, "start": 2868619, "crunched": 0, "end": 2868908, "filename": "/maps/floor.tsx"}, {"audio": 0, "start": 2868908, "crunched": 0, "end": 2869200, "filename": "/maps/objects.tsx"}, {"audio": 0, "start": 2869200, "crunched": 0, "end": 2875685, "filename": "/maps/office.png"}, {"audio": 0, "start": 2875685, "crunched": 0, "end": 2877272, "filename": "/maps/office.tmx"}, {"audio": 0, "start": 2877272, "crunched": 0, "end": 2883809, "filename": "/maps/office_process.png"}, {"audio": 0, "start": 2883809, "crunched": 0, "end": 2890346, "filename": "/maps/office_work.png"}, {"audio": 0, "start": 2890346, "crunched": 0, "end": 2890557, "filename": "/maps/wall.tsx"}], "remote_package_size": 2890557, "package_uuid": "2a97fb1e-6524-4c4c-964c-49baf0ab1c27"});

})();
