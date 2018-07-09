var canvas = document.getElementById('indicator');
var ctx = null;
var rectCanvas = {
  centerX:canvas.clientWidth/2,
  centerY:canvas.clientHeight /2,
  width:canvas.clientWidth,
  height:canvas.clientHeight
};

let stoped = false;
const downloadLink = document.getElementById('download');
var player = document.getElementById('player');
let toggles = document.getElementById('toggles');
let mediaRecorder;
toggles.addEventListener('click',function(){
    if(false === stoped)
    {
      mediaRecorder.stop();
      stoped = true;
    }
});

/* マイクのアクセス権を取得する */
//var handleSuccess = function(stream){
//  //player.srcObject = stream;
//
//  /*　マイク空のデータを保存する */
//  const options = {mimeType: 'video/webm;codecs=vp9'};
//  let recordedChunks = [];
//  console.log("audio/wavは対応して" + (MediaRecorder.isTypeSupported("audio/wav") ? "いる" : "いない"));
//  mediaRecorder = new MediaRecorder(stream);
//
//  mediaRecorder.ondataavailable = function(e){
//    console.log(e.data.type);
//    recordedChunks.push(e.data);
//  };
//
//  mediaRecorder.onstop = function(){
//    downloadLink.href = URL.createObjectURL(new Blob(recordedChunks, { 'type': 'audio/ogg; codecs=opus'}));
//    downloadLink.download = 'acetest.ogg';
//  };
//
//  mediaRecorder.start();
//};
//
//navigator.mediaDevices.getUserMedia({audio:true, video:false})
//  .then(handleSuccess);
//
/*
if (canvas.getContext){
  // コンテキストを取得
  ctx = canvas.getContext('2d');
  // アニメーション開始
  window.requestAnimationFrame(draw);
}

function draw(){
  // 一旦表示をクリア
  ctx.clearRect(0,0,rectCanvas.width,rectCanvas.height);

  // グラデーションを設定
  var grad = ctx.createRadialGradient(rectCanvas.centerX,rectCanvas.centerY,1,rectCanvas.centerX,rectCanvas.centerY,30);

  grad.addColorStop(1, "rgba(255,0,255,1)");
  grad.addColorStop(0, "rgba(255,0,255,0)");

  ctx.fillStyle = grad;

  ctx.beginPath();
  ctx.arc(rectCanvas.centerX,rectCanvas.centerY,30, 0, 2 * Math.PI, false);
  
  ctx.closePath();
  ctx.fill();

  window.requestAnimationFrame(draw);
}
*/