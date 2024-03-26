import RecordRTC from 'recordrtc';

let rtc;

export function startCaptureVideo(canvasDom) {
  rtc = new RecordRTC(canvasDom, {
    type: 'canvas',
  });
  rtc.startRecording();
}

export function stopCaptureVideo(callback) {
  rtc.stopRecording(async (url) => {
    const blob = await rtc.getBlob();
    callback(blob);
  })
}

export function shareVideo(blob) {
  const file = new File([blob], "video.mp4", {type:"video/mp4"});
  const files = [file];

  if(navigator.canShare || navigator.canShare({files})) {
    navigator.share({
      files:files
    })
  }
}