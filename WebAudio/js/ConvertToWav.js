var buffeSize = 1024;
var audioData = [];
var bRecording = false;
var sampleRate = -1;

var encodeWav = (samples, sampleRate) =>{
  // ファイル出力用バッファを作成
  let buffer = new ArrayBuffer(44 + samples.length * 2);
  let view = new DataView(buffer);

  // 文字列バッファ入力用関数
  var writeString = function (view, offset, string){
    for (let i = 0; i < string.length; i++){
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  // floatを16bitPCM波形にして格納関数
  var floatTo16BitPCM = (output, offset, input) => {
    for(var i = 0; i < input.length; i++, offset += 2){
      var s = Math.max(-1, Math.min(1, input[i]));
      output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
  };

  // wavファイルフォーマットに基づいて出力
  writeString(view, 0 , 'RIFF');                    // RIFFヘッダ
  view.setUint32(4, 32 + samples.length * 2, true); // これ以降のファイルサイズ
  writeString(view, 8, 'WAVE');                     // WAVEヘッダ
  writeString(view, 12, 'fmt ');                    // fmtチャンク
  view.setUint32(16, 16, true);                     // fmtチャンクのバイト数
  view.setUint16(20, 1, true);                      // フォーマットID
  view.setUint16(22, 1, true);                      // チャンネル数
  view.setUint32(24, sampleRate, true);             // サンプリングレート
  view.setUint32(28, sampleRate * 2, true);         // データ速度
  view.setUint16(32, 2, true);                      // ブロックサイズ
  view.setUint16(34, 16, true);                     // サンプルあたりのビット数
  writeString(view, 36, 'data');                    // dataチャンク
  view.setUint32(40, samples.length * 2, true);     // 波形データのバイト数
  floatTo16BitPCM(view, 44, samples);               // 波形データ

  return view;

};

var mergeBuffers = function(audioData){
  var sampleLength = 0;

  // 配列長の取得
  for (let i = 0; i < audioData.length; i++)
  {
    sampleLength += audioData[i].length;
  }

  // オーディオ配列を結合
  let samples = new Float32Array(sampleLength);
  let sampleIdx = 0;
  for(let i = 0; i < audioData.length; i++){
    for(let j = 0; j < audioData[i].length; j++){
      samples[sampleIdx] = audioData[i][j];
      sampleIdx++;
    }
  }
  return samples;
}

var exportWav = (audioData) => {
  let dataView = encodeWav(mergeBuffers(audioData), sampleRate);
  return dataView;
};

class ConvertToWav extends AudioWorkletProcessor {
  
  // カスタムパラメータ
  static get parameterDescriptor(){
    return [
    ];
  }
  
  // コンストラクタ
  constructor() {
    // 親コンストラクタの呼び出し必須
    super();
    this.port.onmessage = (event) => {
      let response = {};
      if(event.data.message === "toggleBtnClicked"){
        console.log("Processor:サンプルレート" + event.data.sampleRate);
        sampleRate = event.data.sampleRate;
        bRecording = event.data.Recoding;

        if(bRecording === false){
          // 停止になったので音声ファイルを渡す
          let wavBlob = exportWav(audioData);
          response = {"message":"finish", "wavDataView": wavBlob};
        }
        else
        {
          // 開始になったので初期化して録音開始
          audioData = [];
          response = {"message": "start"};
        }
      }      
      this.port.postMessage(response);
    }
  }
  
  // プロセス本体
  process(inputs, outputs, parameters){
    let input = inputs[0];
    let output = outputs[0];

    let inputChannel0 = input[0];
    let outputChannel0 = output[0];

    var bufferData = new Float32Array(inputChannel0.length);

    for(let i = 0; i < inputChannel0.length; ++i){
      if(bRecording == true){
        bufferData[i] = inputChannel0[i];
      }
      outputChannel0[i] = inputChannel0[i];
    }

    if(true == bRecording){
      audioData.push(bufferData);
    }
    return true;
  }

}

// Processor登録
registerProcessor('convert-to-wav', ConvertToWav);

