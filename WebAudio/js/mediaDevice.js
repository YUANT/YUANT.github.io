/* Create Wave File Blob */
var CreateWaveBlob = function(){};


//-- MediaDevices Pollyfill Start --//
navigator.mediaDevices = navigator.mediaDevices || ((navigator.mozGetUserMedia || navigator.webkitGetUserMedia) ? {
   getUserMedia: function(c) {
     return new Promise(function(y, n) {
       (navigator.mozGetUserMedia ||
        navigator.webkitGetUserMedia).call(navigator, c, y, n);
     });
   }
} : null);
//-- MediaDevices Pollyfill End --//

//-- Check Supported "getUserMedia()" --//
if (!navigator.mediaDevices) {
  console.log("getUserMedia() not supported.");
  return;
}

//-- Audio Only Option Setting --//
var constraints = { audio: true };

//-- 




