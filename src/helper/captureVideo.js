let mediaRecorder;
let recordedChunks = [];
let audioStream;

export function startCaptureVideo(canvasDom) {
  // 获取视频流
  const videoStream = canvasDom.captureStream();

  // 获取音频流
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function(stream) {
      audioStream = stream;
      const combinedStream = new MediaStream([...videoStream.getTracks(), ...stream.getAudioTracks()]);

      // 创建 MediaRecorder 实例
      mediaRecorder = new MediaRecorder(combinedStream);

      // 监听录制的数据块
      mediaRecorder.ondataavailable = function(event) {
        if (event.data.size > 0) {
          recordedChunks.push(event.data);
        }
      };

      // 开始录制音频和视频
      mediaRecorder.start();
    })
    .catch(function(err) {
      console.error('Failed to get audio stream', err);
    });
}

export function stopCaptureVideo(callback) {
  // 停止录制音频和视频
  mediaRecorder.onstop = function() {
    const blob = new Blob(recordedChunks, { type: 'video/mp4' });
    recordedChunks = [];
    callback(blob);
  };

  mediaRecorder.stop();

  // 停止音频流
  if (audioStream) {
    audioStream.getTracks().forEach(track => track.stop());
  }
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