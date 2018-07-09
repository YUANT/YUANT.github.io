var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var ConvertToWavNode;
var bRecording = false;
var localMediaStream ;
var localScriptProcessor;

if(audioCtx.audioWorklet && false){
  audioCtx.audioWorklet.addModule('js/ConvertToWav.js').then(() => {
      navigator.mediaDevices.getUserMedia({audio:true, video:false})
          .then((stream) =>
          {
              let mediaStreamSource = audioCtx.createMediaStreamSource(stream);
              ConvertToWavNode = new AudioWorkletNode(audioCtx, 'convert-to-wav');

              ConvertToWavNode.port.onmessage = (event) => {
                  console.log("Global:" + event.data);
                  if("finish" === event.data.message){
                      let myURL = window.URL || window.webkitURL;
                      let url = myURL.createObjectURL(new Blob([event.data.wavDataView], { type: 'audio/wav' }));
                      let downloadLink = document.getElementById('download');
                      downloadLink.href = url;
                      downloadLink.download = 'test.wav';
                  }
              }
 
              mediaStreamSource.connect(ConvertToWavNode).connect(audioCtx.destination);
          });
  });
}
// AudioWorkletが存在しないときは旧方式で対応
else if(audioCtx.createScriptProcessor)
{
    var OnAudioProcess = (e) =>{
      let input = e.inputBuffer.getChannelData(0);
      let output = e.outputBuffer.getChannelData(0);

      let bufferData = new Float32Array(input.length);
      for (let i = 0; i < input.length; i++){
        if(bRecording == true){
          bufferData[i] = input[i];
        }
        output[i] = input[i];
      }

      if(bRecording == true){
        audioData.push(bufferData);
      }
    };

    navigator.mediaDevices.getUserMedia({audio: true})
        .then((stream) => {
          var scriptProcessor = audioCtx.createScriptProcessor(1024, 1, 1);
          localScriptProcessor = scriptProcessor;
          var mediaStreamsource = audioCtx.createMediaStreamSource(stream);
          localMediaStream = stream;
          mediaStreamsource.connect(scriptProcessor);
          scriptProcessor.onaudioprocess = OnAudioProcess;
          scriptProcessor.connect(audioCtx.destination);
          audioCtx.resume();
        })
        .catch((err) => console.error(err));
}
//　旧方式もないときはlog出力して終わり
else
{

}

document.querySelector("button#toggles").addEventListener("click",(event) => {
    bRecording = !bRecording;
    if(ConvertToWavNode != undefined){
      ConvertToWavNode.port.postMessage({
          "message":"toggleBtnClicked",
          "Recoding":bRecording,
          "sampleRate": audioCtx.sampleRate,
      });
    }
    else
    {
      if(bRecording === false){
          // 停止になったので音声ファイルを渡す
          let wavBlob = exportWav(audioData, audioCtx.sampleRate);
          let myURL = window.URL || window.webkitURL;
          let url = myURL.createObjectURL(new Blob([wavBlob], { type: 'audio/wav' }));
          let downloadLink = document.getElementById('download');
          downloadLink.href = url;
          downloadLink.download = 'test.wav';
          // データを削除
          audioData = [];
        }
        else
        {
          // 開始になったので初期化して録音開始
        }
    }
});
