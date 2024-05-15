export function captureImage(arLib) {
  const { video, renderer, scene, camera,camera2D,scene2D,detect } = arLib;
  const renderCanvas = renderer.domElement;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = renderCanvas.width;
  canvas.height = renderCanvas.height;
  // console.log('videoHeight = ',video.clientHeight)
  // console.log('videoW = ',video.clientWidth)
  // console.log('canvasW = ',canvas.width)
  // console.log('canvasH = ',canvas.height)
  // console.log(renderCanvas.clientWidth)


  const canvas2videoRatio = canvas.height / video.height
  const videoScaledW = video.width * canvas2videoRatio
  
  const sw = video.width * (canvas.width / videoScaledW)
  const sh = video.height
  const sx = (video.width - sw) / 2
  const sy = (video.height - sh) / 2

  console.log(`canvas2videoRatio:${canvas2videoRatio}`)
  console.log(`canvas.w:${canvas.width} h:${canvas.height} video.w:${video.width} h:${video.height}`)
  console.log(`sw=${sw} sh=${sh} sx=${sx} sy=${sy}`)

  /*
  let webcamW = video.width * scale
  let webcamH = video.height * scale

  const sx = (webcamW - canvas.width) / 2
  const sy = (canvas.height - canvas.height) / 2
  const sw = video.width - sx * 2
  const sh = video.height - sy * 2
  */
 
  // let scale = video.clientHeight / video.height
  // const sx =
  //   (((video.clientWidth - renderCanvas.clientWidth) / 2) * video.videoWidth) /
  //   video.clientWidth;


  // const sy =canvas.height - video.height * scale;

  // const sw = video.videoWidth - sx * 2;
  // const sh = video.videoHeight - sy * 2;

  /*
  console.log('canvesHeight', canvas.height)
  console.log('videoHeight', video.height)
  console.log('videoclientHeight', video.clientHeight)
  console.log(scale )
  console.log('result' ,sy )
  */
  context.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

  renderer.preserveDrawingBuffer = true;
  camera.layers.set(0);
  renderer.render(scene, camera);
  
  camera.layers.set(detect);
  renderer.render(scene, camera);
  
  renderer.autoClear = false; // 防止在渲染2D场景前清除现有的渲染
  renderer.render(scene2D, camera2D);
  renderer.autoClear = true; 
  context.drawImage(renderCanvas, 0, 0, canvas.width, canvas.height);
  renderer.preserveDrawingBuffer = false;

  return canvas.toDataURL();
}

export function captureImageFromCanvas(canvas) {
  // 建立一個新的 Canvas 元素來暫存擷取的影像
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');

  // 設定新 Canvas 的寬高與原始 Canvas 相同
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;

  // 在新 Canvas 上繪製原始 Canvas 的影像
  tempCtx.drawImage(canvas, 0, 0);

  // 從新 Canvas 中擷取影像，並返回資料 URL
  const imageDataURL = tempCanvas.toDataURL('image/png');
  
  // 返回影像的資料 URL
  return imageDataURL;
}