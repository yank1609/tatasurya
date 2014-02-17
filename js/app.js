var canvasSource;
var contextSource;
var canvasBlended;
var contextBlended;
var notes = [];
var clicked = 0;
var video;
window.actions = [];
window.firstTime = true;

$(document).ready(function(){
  function hasGetUserMedia() {
    // Note: Opera builds are unprefixed.
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia || navigator.msGetUserMedia);
  }

  if (hasGetUserMedia()) {
    $("#info").hide();
    $("#message").show();
  } else {
    $("#info").show();
    $("#message").hide();
    $("#video-demo").show();
    $("#video-demo")[0].play();
    return;
  }

  var webcamError = function(e) {
    alert('Webcam error!', e);
  };

  video = $('#webcam')[0];
  video.width = window.innerWidth;
  video.height = window.innerHeight;
  if (navigator.getUserMedia) {
    navigator.getUserMedia({
      audio: false, 
      video: true
    }, function(stream) {
      video.src = stream;
      start();
    }, webcamError);
  } else if (navigator.webkitGetUserMedia) {
    navigator.webkitGetUserMedia({
      audio: false, 
      video: true
    }, function(stream) {
      video.src = window.webkitURL.createObjectURL(stream);
      start();
    }, webcamError);
  } else if (navigator.mozGetUserMedia) {
    navigator.mozGetUserMedia({
      audio: false, 
      video: true
    }, function(stream) {
      video.src = window.URL.createObjectURL(stream);
      start();
    }, webcamError);
  } else {
  //video.src = 'somevideo.webm'; // fallback.
  }

  var AudioContext = (
    window.AudioContext ||
    window.webkitAudioContext ||
    window.mozAudioContext ||
    null
    );

  var timeOut, lastImageData;
  canvasSource = $("#canvas-source")[0];
  canvasBlended = $("#canvas-blended")[0];

  contextSource = canvasSource.getContext('2d');
  contextBlended = canvasBlended.getContext('2d');
  
  canvasSource.width = window.innerWidth;
  canvasSource.height = window.innerHeight;
  canvasBlended.width = window.innerWidth;
  canvasBlended.height = window.innerHeight;
  var soundContext;
  var bufferLoader;

  // mirror video
  contextSource.translate(canvasSource.width, 0);
  contextSource.scale(-1, 1);
  
  var c = 5;


  function doSomething(obj, txt) {
    var f = new Function(txt);
    f();
  }


  function start() {
    $(canvasSource).show();
    update();
  }

  window.requestAnimFrame = (function () {
    return window.requestAnimationFrame       ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    window.oRequestAnimationFrame      ||
    window.msRequestAnimationFrame     ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    };
  })();
  
  function update() {
    drawVideo();
    blend();
    getCoords();
    if(firstTime != true){
      checkAreas();
    }
    requestAnimFrame(update);
  }

  function drawVideo() {
    contextSource.drawImage(video, 0, 0, video.width, video.height);
  }

  function blend() {
    var width = canvasSource.width;
    var height = canvasSource.height;
    // get webcam image data
    var sourceData = contextSource.getImageData(0, 0, width, height);
    // create an image if the previous image doesn’t exist
    if (!lastImageData) lastImageData = contextSource.getImageData(0, 0, width, height);
    // create a ImageData instance to receive the blended result
    var blendedData = contextSource.createImageData(width, height);
    // blend the 2 images
    differenceAccuracy(blendedData.data, sourceData.data, lastImageData.data);
    // draw the result in a canvas
    contextBlended.putImageData(blendedData, 0, 0);
    // store the current webcam image
    lastImageData = sourceData;
  }

  function fastAbs(value) {
    // funky bitwise, equal Math.abs
    return (value ^ (value >> 31)) - (value >> 31);
  }

  function threshold(value) {
    return (value > 0x15) ? 0xFF : 0;
  }

  function difference(target, data1, data2) {
    // blend mode difference
    if (data1.length != data2.length) return null;
    var i = 0;
    while (i < (data1.length * 0.25)) {
      target[4*i] = data1[4*i] == 0 ? 0 : fastAbs(data1[4*i] - data2[4*i]);
      target[4*i+1] = data1[4*i+1] == 0 ? 0 : fastAbs(data1[4*i+1] - data2[4*i+1]);
      target[4*i+2] = data1[4*i+2] == 0 ? 0 : fastAbs(data1[4*i+2] - data2[4*i+2]);
      target[4*i+3] = 0xFF;
      ++i;
    }
  }

  function differenceAccuracy(target, data1, data2) {
    if (data1.length != data2.length) return null;
    var i = 0;
    while (i < (data1.length * 0.25)) {
      var average1 = (data1[4*i] + data1[4*i+1] + data1[4*i+2]) / 3;
      var average2 = (data2[4*i] + data2[4*i+1] + data2[4*i+2]) / 3;
      var diff = threshold(fastAbs(average1 - average2));
      target[4*i] = diff;
      target[4*i+1] = diff;
      target[4*i+2] = diff;
      target[4*i+3] = 0xFF;
      ++i;
    }
  }

  function checkAreas() {
    // loop over the marked areas
    for(var r = 0;r < actions.length;r++){
      var actData = actions[r];
      var blendedData = contextBlended.getImageData(actData.x, actData.y, actData.width, actData.height);
      var i = 0;
      var average = 0;
      // loop over the pixels
      while (i < (blendedData.data.length * 0.25)) {
        // make an average between the color channel
        average += (blendedData.data[i*4] + blendedData.data[i*4+1] + blendedData.data[i*4+2]) / 3;
        ++i;
      }
      // calculate an average between of the color values of the note area
      average = Math.round(average / (blendedData.data.length * 0.25));
      if (average > 10) {
        // over a small limit, consider that a movement is detected
        // play do something and show a visual feedback to the user
        //        doSomething(actData.act)
        if($(actData.el).hasClass("disabled-motion") != true){
          if(actData.el.tagName == "LABEL"){
            $(actData.el).find("input").trigger("click")
          }else {
            $(actData.el).trigger("click");
          }
        }
      }
    }
    
    firstTime = false;
    
  }

  canvasBlended.onmousemove = function(e) {

    var pos = getMousePos(this, e), /// provide this canvas and event
    x = pos.x,
    y = pos.y;
  /// check x and y against the grid
  }
})

function getCoords(){
  $("[data-motion-marker='true'][class!='disabled-motion']").each(function(i, el){
    actions[i] = {
      x: $(this).offset().left,
      y: $(this).offset().top,
      width: $(this).innerWidth(),
      height: $(this).innerHeight(),
      el: el
    }
  })
}