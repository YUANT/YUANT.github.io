class ConvertToWavNode extends AudioWorkletNode {
  constructor(context){
    super(context, 'convert-to-wav');
  }
}

let context = new AudioContext();

context.audioWorklet.addModule('js/ConvertToWav.js').then(() => {
  let node = new ConvertToWavNode(context);
});