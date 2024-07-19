let mediaRecorder;
let recordedChunks = [];
let currentBackgroundAudioElement = null;
let audioContext = null;
let backgroundAudioSource = null;
let destination = null;

export async function startCaptureVideo(canvasDom, backgroundAudioElement) {
  try {
    // 获取视频流
    const videoStream = canvasDom.captureStream();

    // 检查背景音乐元素是否变化
    if (backgroundAudioElement !== currentBackgroundAudioElement) {
      currentBackgroundAudioElement = backgroundAudioElement;
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      backgroundAudioSource = audioContext.createMediaElementSource(backgroundAudioElement);

      // 创建目标节点
      destination = audioContext.createMediaStreamDestination();
      backgroundAudioSource.connect(destination);
      backgroundAudioSource.connect(audioContext.destination);

      // 更新全局目标节点流
      window.destinationStream = destination.stream;
    }

    // 合并视频流和音频流
    const combinedStream = new MediaStream([...videoStream.getTracks(), ...window.destinationStream.getAudioTracks()]);


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
    console.error('Failed to start video capture', error);
  }
}

export function stopCaptureVideo(callback) {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.onstop = function () {
      const blob = new Blob(recordedChunks, { type: 'video/mp4' });
      recordedChunks = [];
      callback(blob);
    };

    mediaRecorder.stop();

    // 停止音频流
    if (audioContext) {
      // audioContext.close();
    }
  }
}

export function shareVideo(blob) {
  const file = new File([blob], 'video.webm', { type: 'video/webm' });
  const files = [file];

  if (navigator.canShare && navigator.canShare({ files })) {
    navigator.share({
      files: files
    });
  } else {
    console.error('Sharing not supported');
  }
}