
export async function switchCamera(arLib,mode ) {
    let { video } = arLib
    const facingMode = mode ? 'user' : 'environment';
    console.log(facingMode,mode)
    const constraints = {
      video: {
        facingMode: { exact: facingMode },
      },
    };
    try {
      let stream = await navigator.mediaDevices.getUserMedia(constraints);
      video.srcObject = stream;
    } catch (error) {
      if (error.name === 'OverconstrainedError') {
        const cameras = await getCameras();
        const deviceId = mode ? cameras[0].deviceId : cameras[cameras.length - 1].deviceId;
        let stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: deviceId } }
        });
        video.srcObject = stream;
      } else {
        throw error;
      }
    }
  
  
  
  }
  
  async function getCameras() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    return videoDevices;
  }
  