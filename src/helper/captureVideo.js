let mediaRecorder;
let recordedChunks = [];
let audioStream;

export async function startCaptureVideo(canvasDom,backgroundAudioElement) {
  // 获取视频流
  const videoStream = canvasDom.captureStream();

  // 创建音频上下文
  const audioContext = new AudioContext();
  const destination = audioContext.createMediaStreamDestination();

  // 获取背景音乐的音频流
  const backgroundAudioSource = audioContext.createMediaElementSource(backgroundAudioElement);
  backgroundAudioSource.connect(destination);
  backgroundAudioSource.connect(audioContext.destination); 

  // 将背景音乐的音频流与视频流合并
  const combinedStream = new MediaStream([...videoStream.getTracks(), ...destination.stream.getAudioTracks()]);


  try {
    let options;
    if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
      options = { mimeType: 'video/webm; codecs=vp9' };
      mediaRecorder = new MediaRecorder(combinedStream, options);
    } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
      options = { mimeType: 'video/webm; codecs=vp8' };
      mediaRecorder = new MediaRecorder(combinedStream, options);
    } else {
      mediaRecorder = new MediaRecorder(combinedStream);
    }

    mediaRecorder.ondataavailable = function (event) {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    mediaRecorder.start();
  } catch (error) {
    console.error('Failed to get media stream', error);
  }
}


export function stopCaptureVideo(callback) {
  // 停止录制音频和视频
  mediaRecorder.onstop = function () {
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