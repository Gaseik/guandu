export async function switchCamera(arLib, mode) {
  let { video } = arLib;
  const facingMode = mode ? 'user' : 'environment';
  console.log(`Switching camera to ${facingMode} mode.`);

  // Release current media stream
  if (video.srcObject) {
    let tracks = video.srcObject.getTracks();
    tracks.forEach(track => track.stop());
    video.srcObject = null;
  }

  const constraints = {
    video: {
      facingMode: { exact: facingMode },
    },
  };

  try {
    console.log(`Trying to get media stream with facingMode: ${facingMode}`);
    let stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;
  } catch (error) {
    console.error(`Error getting media stream with facingMode: ${facingMode}`, error);
    if (error.name === 'OverconstrainedError' || error.name === 'NotFoundError' || error.name === 'NotReadableError') {
      try {
        const cameras = await getCameras();
        const deviceId = mode ? getFrontCameraId(cameras) : getBackCameraId(cameras);
        if (deviceId) {
          console.log(`Trying to get media stream with deviceId: ${deviceId}`);
          let stream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: { exact: deviceId } }
          });
          video.srcObject = stream;
        } else {
          console.error('No suitable camera found.');
        }
      } catch (deviceError) {
        console.error('Error getting media stream with deviceId:', deviceError);
        throw deviceError;
      }
    } else {
      throw error;
    }
  }
}

async function getCameras() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const videoDevices = devices.filter(device => device.kind === 'videoinput');
  console.log('Available video devices:', videoDevices);
  return videoDevices;
}
function getFrontCameraId(cameras) {
  for (const camera of cameras) {
    if (camera.label.toLowerCase().includes('front')) {
      return camera.deviceId;
    }
  }
  return cameras.length > 0 ? cameras[0].deviceId : null;
}

function getBackCameraId(cameras) {
  for (const camera of cameras) {
    if (camera.label.toLowerCase().includes('back')) {
      return camera.deviceId;
    }
  }
  return cameras.length > 1 ? cameras[cameras.length - 1].deviceId : null;
}