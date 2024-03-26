let mediaRecorder;
let recordedChunks = [];

export function startCaptureVideo(canvasDom) {
  const stream = canvasDom.captureStream(); // 获取 canvas 的媒体流
  mediaRecorder = new MediaRecorder(stream);

  // 监听录制的数据块
  mediaRecorder.ondataavailable = function(event) {
    if (event.data.size > 0) {
      recordedChunks.push(event.data);
    }
  };

  mediaRecorder.start();
}

export function stopCaptureVideo(callback) {
  mediaRecorder.onstop = function() {
    const blob = new Blob(recordedChunks, { type: 'video/mp4' });
    recordedChunks = [];
    callback(blob);
  };

  mediaRecorder.stop();
}

export function shareVideo(blob) {
  const file = new File([blob], 'video.mp4', { type: 'video/mp4' });
  const files = [file];

  if (navigator.canShare || navigator.canShare({ files })) {
    navigator.share({
      files: files
    });
  }
}